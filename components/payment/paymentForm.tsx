"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { formatAmount } from "@/lib/payment";

type Props = {
  enrollmentId: string;
  packTitle: string;
  /** initial : choix complet / en 2 fois · second : il reste la 2e tranche */
  mode: "initial" | "second";
  priceFull: number;
  priceInstallment: number;
  methods: { value: string; label: string }[];
  lastRejected: boolean;
};

export default function PaymentForm({
  enrollmentId,
  packTitle,
  mode,
  priceFull,
  priceInstallment,
  methods,
  lastRejected,
}: Props) {
  const router = useRouter();
  const hasInstallment = priceInstallment > 0;
  const [option, setOption] = useState<"FULL" | "INSTALLMENT">(mode === "second" ? "INSTALLMENT" : "FULL");
  const [method, setMethod] = useState(methods[0]?.value ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const payable = mode === "second" ? hasInstallment : priceFull > 0;
  const amount = mode === "second" || option === "INSTALLMENT" ? priceInstallment : priceFull;

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, option, method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue. Réessaie plus tard.");
        setLoading(false);
        return;
      }
      router.refresh(); // la page serveur affiche alors la référence et le QR code
    } catch {
      setError("Impossible de contacter le serveur. Réessaie plus tard.");
      setLoading(false);
    }
  }

  const optionCard = (selected: boolean) =>
    `w-full text-left px-5 py-4 rounded-xl border transition-colors duration-300 ${
      selected ? "bg-[#00A3FF]/10 border-[#00A3FF]/60" : "bg-white/5 border-white/10 hover:border-white/30"
    }`;

  return (
    <div className="space-y-6">
      {lastRejected && (
        <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-sm text-red-300">
          Ton dernier paiement n'a pas pu être validé. Tu peux refaire une demande ci-dessous.
        </div>
      )}

      {!payable && (
        <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-sm text-yellow-300">
          Le tarif de « {packTitle} » n'est pas encore défini. Reviens un peu plus tard ou contacte l'équipe.
        </div>
      )}

      {mode === "initial" && payable && (
        <div>
          <p className="text-xs font-semibold text-gray-300 mb-2">Formule</p>
          <div className="space-y-2">
            <button type="button" onClick={() => setOption("FULL")} className={optionCard(option === "FULL")}>
              <p className="text-sm font-semibold text-white">Paiement complet</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatAmount(priceFull)}</p>
            </button>
            {hasInstallment && (
              <button type="button" onClick={() => setOption("INSTALLMENT")} className={optionCard(option === "INSTALLMENT")}>
                <p className="text-sm font-semibold text-white">Paiement en 2 fois</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatAmount(priceInstallment)} maintenant, puis {formatAmount(priceInstallment)} pour la 2e tranche
                </p>
              </button>
            )}
          </div>
        </div>
      )}

      {mode === "second" && payable && (
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
          <p className="text-sm font-semibold text-white">2e tranche</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatAmount(priceInstallment)}</p>
        </div>
      )}

      {payable && (
        <div>
          <p className="text-xs font-semibold text-gray-300 mb-2">Mode de paiement</p>
          <div className="space-y-2">
            {methods.map((m) => (
              <button key={m.value} type="button" onClick={() => setMethod(m.value)} className={optionCard(method === m.value)}>
                <p className="text-sm font-semibold text-white">{m.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {payable && (
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !method}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full px-6 py-3.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] disabled:opacity-60 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,163,255,0.5)] transition duration-300"
        >
          {loading ? "Enregistrement..." : `Continuer — ${formatAmount(amount)}`}
        </motion.button>
      )}
    </div>
  );
}