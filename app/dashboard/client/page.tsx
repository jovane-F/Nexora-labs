"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const upcoming = [
  "Suivi des projets en cours et de leur avancement",
  "Consultation et validation des devis",
  "Gestion des tickets de support",
  "Historique des paiements",
];

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-32 pb-20 px-4 sm:px-8 relative overflow-hidden flex items-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center relative z-10"
      >
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-4">
          Espace Client
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mb-4">Bientôt disponible</h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8">
          Ton espace client est en cours de construction. Voici ce qu'il contiendra :
        </p>

        <div className="text-left p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 mb-8">
          {upcoming.map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
              <span className="text-[#00A3FF] mt-0.5">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition duration-300"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </main>
  );
}