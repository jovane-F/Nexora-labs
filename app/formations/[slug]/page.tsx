"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getPackBySlug } from "@/lib/formations-data";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A3FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PackDetailPage() {
  const params = useParams<{ slug: string }>();
  const pack = getPackBySlug(params.slug);

  if (!pack) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-32 pb-24 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Fil d'ariane */}
        <Link href="/formations" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00A3FF] transition-colors mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Tous les packs
        </Link>

        {/* En-tête du pack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-[#00A3FF] bg-[#00A3FF]/10 border border-[#00A3FF]/20 px-2.5 py-1 rounded-md">
              Pack {pack.id}
            </span>
            {pack.popular && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#00A3FF] px-2 py-0.5 rounded-full">
                Populaire
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{pack.name}</h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">{pack.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {pack.stack.map((tech) => (
              <span key={tech} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                {tech}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 mb-12">
            <div>
              <span className="block text-lg font-bold text-white">{pack.duration}</span>
              <span className="text-xs text-gray-400">Durée</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">{pack.sessions}</span>
              <span className="text-xs text-gray-400">Rythme</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">{pack.level}</span>
              <span className="text-xs text-gray-400">Niveau</span>
            </div>
            <div>
              <span className="block text-lg font-bold text-white">{pack.lead}</span>
              <span className="text-xs text-gray-400">Encadrement</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Programme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <h2 className="text-xl font-bold text-white mb-2">Programme</h2>
            {pack.program.map((month) => (
              <div key={month.month} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-[#00A3FF] bg-[#00A3FF]/10 border border-[#00A3FF]/20 px-2.5 py-1 rounded-md">
                    {month.month}
                  </span>
                  <h3 className="text-base font-bold text-white">{month.title}</h3>
                </div>
                <ul className="space-y-2">
                  {month.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <CheckIcon />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Sidebar : prérequis + inscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="text-base font-bold text-white mb-4">Prérequis</h3>
              <ul className="space-y-2.5">
                {pack.prerequisites.map((req) => (
                  <li key={req} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <CheckIcon />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#00A3FF]/15 to-transparent border border-[#00A3FF]/30">
              <p className="text-sm text-gray-300 mb-4">
                Prêt à démarrer le pack <span className="text-white font-semibold">{pack.name}</span> ?
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/devis?pack=${pack.slug}`}
                  className="flex items-center justify-center px-6 py-3.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-sm shadow-[0_0_25px_rgba(0,163,255,0.5)] transition duration-300 w-full"
                >
                  S'inscrire à ce pack
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}