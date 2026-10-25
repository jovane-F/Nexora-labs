import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  ENABLED_METHODS,
  METHOD_LABELS,
  PAYMENT_INSTRUCTIONS,
  PAYMENT_TYPE_LABELS,
  computePaymentState,
  formatAmount,
  type PayMethod,
} from "@/lib/payment";
import PaymentForm from "@/components/payment/paymentForm";

export const dynamic = "force-dynamic";

const shell = "min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden";

function Glow() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />
  );
}

export default async function PaymentPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;

  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    redirect("/connexion?espace=etudiant");
  }
  if (!/^\d+$/.test(enrollmentId)) notFound();

  const studentId = BigInt(session.uid);

  // Seul le propriétaire de l'inscription peut ouvrir cette page.
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: BigInt(enrollmentId), studentId },
    select: { id: true, sessionId: true, status: true },
  });
  if (!enrollment) notFound();
  if (String(enrollment.status) === "CANCELLED") redirect("/dashboard/etudiant");

  const academySession = await prisma.academySession.findUnique({
    where: { id: enrollment.sessionId },
    select: { packId: true },
  });
  const pack = academySession
    ? await prisma.pack.findUnique({
        where: { id: academySession.packId },
        select: { title: true, priceFull: true, priceInstallment: true },
      })
    : null;
  if (!pack) notFound();

  const payments = await prisma.payment.findMany({
    where: { enrollmentId: enrollment.id },
    orderBy: { createdAt: "desc" },
    select: { status: true, type: true, method: true, amount: true, transactionReference: true },
  });

  const state = computePaymentState(payments.map((p) => ({ status: String(p.status), type: String(p.type) })));
  const pending = payments.find((p) => String(p.status) === "PENDING");

  // 1. Tout est réglé
  if (state.nextStep === "done") {
    return (
      <main className={shell}>
        <Glow />
        <div className="max-w-lg mx-auto relative z-10 text-center">
          <h1 className="text-3xl font-black mb-3">Paiement complet ✅</h1>
          <p className="text-gray-400 text-sm mb-8">« {pack.title} » est entièrement réglé. Merci !</p>
          <Link href="/dashboard/etudiant" className="inline-flex px-6 py-3 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-sm transition">
            Retour à mon espace
          </Link>
        </div>
      </main>
    );
  }

  // 2. Un paiement attend la vérification de l'équipe : référence + QR code
  if (pending) {
    const reference = pending.transactionReference;
    const amount = Number(pending.amount);
    const method = String(pending.method) as PayMethod;
    const instructions = PAYMENT_INSTRUCTIONS[method] ?? [];
    const qr = await QRCode.toDataURL(`NEXORA|${reference}|${amount}`, {
      margin: 1,
      width: 240,
      color: { dark: "#0B0E17", light: "#FFFFFF" },
    });

    return (
      <main className={shell}>
        <Glow />
        <div className="max-w-lg mx-auto relative z-10">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold uppercase tracking-wider mb-4">
            En attente de vérification
          </span>
          <h1 className="text-3xl font-black tracking-tight mb-2">Finalise ton paiement</h1>
          <p className="text-gray-400 text-sm mb-8">
            {pack.title} · {PAYMENT_TYPE_LABELS[String(pending.type)] ?? String(pending.type)} ·{" "}
            <span className="text-white font-semibold">{formatAmount(amount)}</span>
          </p>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt={`QR code de la référence ${reference}`} width={160} height={160} className="rounded-xl bg-white p-1 shrink-0" />
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-400 mb-1">Ta référence de paiement</p>
                <p className="text-2xl font-mono font-black tracking-wider text-[#00A3FF]">{reference}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Indique-la comme motif / message de ton paiement : c'est elle qui permet à l'équipe de le retrouver.
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="text-xs font-semibold text-gray-300 mb-2">Payer par {METHOD_LABELS[method] ?? method}</p>
              {instructions.length > 0 ? (
                <ul className="space-y-1.5">
                  {instructions.map((line) => (
                    <li key={line} className="text-sm text-gray-300">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  Les coordonnées pour ce mode de paiement te seront communiquées par l'équipe Nexora. Garde bien ta
                  référence.
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-5 leading-relaxed">
            Une fois ton paiement vérifié par l'équipe, ton inscription est confirmée et tes supports de cours se
            débloquent automatiquement dans ton espace. Cette page se met à jour quand tu la recharges.
          </p>

          <Link href="/dashboard/etudiant" className="inline-flex mt-6 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition">
            Retour à mon espace
          </Link>
        </div>
      </main>
    );
  }

  // 3. Aucun paiement en cours : formulaire
  return (
    <main className={shell}>
      <Glow />
      <div className="max-w-lg mx-auto relative z-10">
        <Link href="/dashboard/etudiant" className="inline-flex text-sm text-gray-400 hover:text-[#00A3FF] transition-colors mb-6">
          ← Retour à mon espace
        </Link>
        <h1 className="text-3xl font-black tracking-tight mb-2">Régler mon inscription</h1>
        <p className="text-gray-400 text-sm mb-8">
          Pack : <span className="text-white font-semibold">{pack.title}</span>
        </p>

        <PaymentForm
          enrollmentId={enrollment.id.toString()}
          packTitle={pack.title}
          mode={state.nextStep === "second" ? "second" : "initial"}
          priceFull={Number(pack.priceFull)}
          priceInstallment={pack.priceInstallment === null ? 0 : Number(pack.priceInstallment)}
          methods={ENABLED_METHODS.map((m) => ({ value: m, label: METHOD_LABELS[m] }))}
          lastRejected={state.lastRejected}
        />
      </div>
    </main>
  );
}