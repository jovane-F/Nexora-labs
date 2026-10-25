import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import {
  SESSION_COOKIE,
  createSessionToken,
  dashboardPathForRole,
  sessionCookieOptions,
} from "@/lib/session";

type Espace = "etudiant" | "client" | "admin";

// Rôle (colonne users.role) autorisé pour chaque espace.
const roleForEspace: Record<Espace, string> = {
  etudiant: "STUDENT",
  client: "CLIENT",
  admin: "ADMIN",
};

const roleLabel: Record<string, string> = {
  STUDENT: "étudiant",
  CLIENT: "client",
  ADMIN: "administrateur",
  INSTRUCTOR: "formateur",
};

function isEspace(value: unknown): value is Espace {
  return value === "etudiant" || value === "client" || value === "admin";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const espace = body.espace;

  if (!email || !password || !isEspace(espace)) {
    return NextResponse.json({ error: "Merci de renseigner ton email et ton mot de passe." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, passwordHash: true, isActive: true },
    });

    // Même message que le compte existe ou non : on ne révèle pas quels emails sont inscrits.
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Ce compte est désactivé." }, { status: 403 });
    }

    const role = String(user.role);

    if (role !== roleForEspace[espace]) {
      return NextResponse.json(
        {
          error: `Ce compte est un compte ${roleLabel[role] ?? role}. Choisis l'onglet correspondant.`,
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ redirect: dashboardPathForRole(role) });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user.id.toString(), role), sessionCookieOptions);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}