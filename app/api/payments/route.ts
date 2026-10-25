import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ENABLED_METHODS, computePaymentState, type PayMethod } from "@/lib/payment";
import { generateReference } from "@/lib/payment-reference";

function isMethod(value: unknown): value is PayMethod {
  return typeof value === "string" && (ENABLED_METHODS as string[]).includes(value);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT" || !/^\d+$/.test(session.uid)) {
    return NextResponse.json({ error: "Connecte-toi pour effectuer un paiement." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const enrollmentId = typeof body.enrollmentId === "string" ? body.enrollmentId : "";
  const option = body.option === "INSTALLMENT" ? "INSTALLMENT" : "FULL";
  const method = body.method;

  if (!/^\d+$/.test(enrollmentId) || !isMethod(method)) {
    return NextResponse.json({ error: "Demande de paiement invalide." }, { status: 400 });
  }

  try {
    const studentId = BigInt(session.uid);

    // L'inscription doit appartenir à l'étudiant connecté.
    const enrollment = await prisma.enrollment.findFirst({
      where: { id: BigInt(enrollmentId), studentId },
      select: { id: true, sessionId: true, status: true },
    });
    if (!enrollment || String(enrollment.status) === "CANCELLED") {
      return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
    }

    const academySession = await prisma.academySession.findUnique({
      where: { id: enrollment.sessionId },
      select: { packId: true },
    });
    const pack = academySession
      ? await prisma.pack.findUnique({
          where: { id: academySession.packId },
          select: { priceFull: true, priceInstallment: true },
        })
      : null;
    if (!pack) {
      return NextResponse.json({ error: "Pack introuvable." }, { status: 404 });
    }

    const existing = await prisma.payment.findMany({
      where: { enrollmentId: enrollment.id },
      select: { status: true, type: true },
    });
    const state = computePaymentState(existing.map((p) => ({ status: String(p.status), type: String(p.type) })));

    if (state.hasPending) {
      return NextResponse.json({ error: "Un paiement est déjà en cours de vérification." }, { status: 409 });
    }
    if (state.nextStep === "done") {
      return NextResponse.json({ error: "Ce pack est déjà entièrement réglé." }, { status: 409 });
    }

    // Le montant et le type sont toujours calculés ici, jamais lus depuis le navigateur.
    const hasInstallment = pack.priceInstallment !== null && Number(pack.priceInstallment) > 0;
    let type: "FULL" | "INSTALLMENT_1" | "INSTALLMENT_2";
    let amount: Prisma.Decimal;

    if (state.nextStep === "second") {
      if (!hasInstallment || pack.priceInstallment === null) {
        return NextResponse.json({ error: "Le tarif de la 2e tranche n'est pas défini." }, { status: 409 });
      }
      type = "INSTALLMENT_2";
      amount = pack.priceInstallment;
    } else if (option === "INSTALLMENT") {
      if (!hasInstallment || pack.priceInstallment === null) {
        return NextResponse.json({ error: "Le paiement en deux fois n'est pas disponible pour ce pack." }, { status: 409 });
      }
      type = "INSTALLMENT_1";
      amount = pack.priceInstallment;
    } else {
      if (Number(pack.priceFull) <= 0) {
        return NextResponse.json({ error: "Le tarif de ce pack n'est pas encore défini." }, { status: 409 });
      }
      type = "FULL";
      amount = pack.priceFull;
    }

    // La référence est unique en base : on réessaie en cas de collision très improbable.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const payment = await prisma.payment.create({
          data: {
            userId: studentId,
            enrollmentId: enrollment.id,
            amount,
            method,
            type,
            status: "PENDING" as const,
            transactionReference: generateReference(),
          },
          select: { transactionReference: true },
        });
        return NextResponse.json({ reference: payment.transactionReference }, { status: 201 });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") continue;
        throw err;
      }
    }

    return NextResponse.json({ error: "Impossible de générer une référence. Réessaie." }, { status: 500 });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}