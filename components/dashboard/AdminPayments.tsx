"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export type PendingPaymentRow = {
  id: string;
  reference: string;
  studentName: string;
  email: string;
  phone: string | null;
  packTitle: string;
  typeLabel: string;
  methodLabel: string;
  amountLabel: string;
  createdLabel: string;
};

export default function AdminPayments({ firstName, rows }: { firstName: string; rows: PendingPaymentRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function decide(row: PendingPaymentRow, action: "validate" | "reject") {
    const question =
      action === "validate"
        ? `Confirmer que tu as bien reçu ${row.amountLabel} (référence ${row.reference}) ?\nL'inscription de ${row.studentName} sera activée.`
        : `Rejeter le paiement ${row.reference} de ${row.studentName} ?`;
    if (!window.confirm(question)) return;

    setError("");
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/payments/${row.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Une erreur est survenue.");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/connexion?espace=admin");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider">
              Administration
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-colors disabled:opacity-60"
            >
              {loggingOut ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Bonjour {firstName} 👋</h1>
          <p className="text-gray-400 text-sm mt-2">
            {rows.length === 0
              ? "Aucun paiement à vérifier pour le moment."
              : `${rows.length} paiement${rows.length > 1 ? "s" : ""} à vérifier.`}
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-sm text-red-300">{error}</div>
        )}

        <div className="space-y-4">
          {rows.map((row) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="font-mono text-lg font-black tracking-wider text-[#00A3FF]">{row.reference}</p>
                  <p className="text-sm text-white font-semibold">{row.studentName}</p>
                  <p className="text-xs text-gray-400">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  <p className="text-xs text-gray-400">
                    {row.packTitle} · {row.typeLabel} · {row.methodLabel}
                  </p>
                  <p className="text-xs text-gray-500">Demandé le {row.createdLabel}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-xl font-black text-white">{row.amountLabel}</p>
                  <div className="flex sm:justify-end gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => decide(row, "reject")}
                      disabled={busyId === row.id}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-red-400/10 border border-white/10 hover:border-red-400/40 text-xs font-semibold text-gray-300 hover:text-red-300 transition-colors disabled:opacity-60"
                    >
                      Rejeter
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(row, "validate")}
                      disabled={busyId === row.id}
                      className="px-4 py-2 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white text-xs font-bold transition-colors disabled:opacity-60"
                    >
                      {busyId === row.id ? "..." : "Valider"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}