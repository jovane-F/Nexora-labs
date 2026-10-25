import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

type SignupRole = "CLIENT" | "STUDENT";

function normalizeRole(value: unknown): SignupRole {
  return value === "STUDENT" ? "STUDENT" : "CLIENT";
}

function normalizeSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const slugs = value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
  return Array.from(new Set(slugs)).slice(0, 10);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
  const password = typeof body.password === "string" ? body.password : "";
  const role = normalizeRole(body.role);
  const packSlugs = role === "STUDENT" ? normalizeSlugs(body.packSlugs) : [];

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Merci de remplir tous les champs obligatoires." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
  }

  if (role === "STUDENT" && packSlugs.length === 0) {
    return NextResponse.json({ error: "Choisis au moins un pack pour t'inscrire." }, { status: 400 });
  }

  try {
    // Pour chaque pack choisi, on retrouve en base la prochaine session ouverte aux inscriptions.
    const toJoin: { slug: string; sessionId: number }[] = [];

    if (packSlugs.length > 0) {
      const dbPacks = await prisma.pack.findMany({
        where: { slug: { in: packSlugs }, isActive: true },
        select: { id: true, slug: true },
      });

      const sessions = await prisma.academySession.findMany({
        where: { packId: { in: dbPacks.map((p) => p.id) }, isOpenForEnrollment: true },
        orderBy: { startDate: "asc" },
        select: { id: true, packId: true },
      });

      for (const pack of dbPacks) {
        const session = sessions.find((s) => s.packId === pack.id);
        if (session) toJoin.push({ slug: pack.slug, sessionId: session.id });
      }
    }

    const enrolledSlugs = new Set(toJoin.map((j) => j.slug));
    const unavailable = packSlugs.filter((slug) => !enrolledSlugs.has(slug));

    const passwordHash = await hashPassword(password);

    // Compte + inscriptions dans une seule transaction : tout est créé, ou rien.
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { firstName, lastName, email, phone, passwordHash, role },
        select: { id: true, email: true, role: true },
      });

      if (toJoin.length > 0) {
        await tx.enrollment.createMany({
          data: toJoin.map((j) => ({
            studentId: created.id,
            sessionId: j.sessionId,
            status: "PENDING" as const,
          })),
        });
      }

      return created;
    });

    return NextResponse.json(
      {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        enrolled: toJoin.map((j) => j.slug),
        unavailable,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    }

    console.error("Signup error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}