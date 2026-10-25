import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  // Le rôle est revérifié en base : un cookie vieux de plusieurs jours ne suffit pas.
  const admin = await prisma.user.findUnique({
    where: { id: BigInt(session.uid) },
    select: { role: true, isActive: true },
  });
  if (!admin || !admin.isActive || String(admin.role) !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const action = body.action;
  if (action !== "validate" && action !== "reject") {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }

  try {
    const paymentId = BigInt(id);

    const outcome = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        select: { enrollmentId: true },
      });
      if (!payment) return "not_found" as const;

      // La condition status = PENDING rend la décision atomique : deux admins ne peuvent pas la prendre deux fois.
      const updated = await tx.payment.updateMany({
        where: { id: paymentId, status: "PENDING" },
        data: {
          status: action === "validate" ? "SUCCESSFUL" : "FAILED",
          paymentDetails: {
            decision: action,
            reviewedBy: session.uid,
            reviewedAt: new Date().toISOString(),
          },
        },
      });
      if (updated.count === 0) return "already_processed" as const;

      // Paiement validé : l'inscription passe en ACTIVE et débloque les contenus.
      if (action === "validate" && payment.enrollmentId !== null) {
        await tx.enrollment.updateMany({
          where: { id: payment.enrollmentId, status: "PENDING" },
          data: { status: "ACTIVE" },
        });
      }

      return "ok" as const;
    });

    if (outcome === "not_found") {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
    }
    if (outcome === "already_processed") {
      return NextResponse.json({ error: "Ce paiement a déjà été traité." }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Payment review error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}   