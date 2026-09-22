"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { packs } from "@/lib/formations-data";

// === ICÔNES SVG VECTORIELLES ===
function UserBadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// === VARIANTS D'ANIMATIONS TYPÉS ===
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

export default function PacksPreview() {
  return (
    <section id="formations" className="py-24 bg-[#0B0E17] px-6 relative overflow-hidden">
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* En-tête */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-3">
            Parcours de Formation
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            3 Mois — 3 Sessions / Semaine
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Apprenez, créez et innovez à travers nos packs pratiques encadrés par des experts.
          </p>
          <Link
            href="/formations"
            className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#00A3FF] hover:translate-x-1 transition-transform duration-300"
          >
            Voir tous les packs
            <ArrowRightIcon />
          </Link>
        </motion.div>

        {/* Grille des packs */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {packs.map((pack) => (
            <motion.div
              key={pack.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                borderColor: "rgba(0,163,255,0.5)",
                boxShadow: "0px 10px 30px rgba(0,163,255,0.15)"
              }}
              className={`relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border transition-all duration-300 backdrop-blur-xl group overflow-hidden ${
                pack.popular ? "border-[#00A3FF]/60" : "border-white/10"
              }`}
            >
              {/* Effet Neon Flare au survol */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A3FF]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* ID + Populaire Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-[#00A3FF] bg-[#00A3FF]/10 border border-[#00A3FF]/20 px-2.5 py-1 rounded-md">
                    Pack {pack.id}
                  </span>
                  {pack.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#00A3FF] px-2 py-0.5 rounded-full">
                      Populaire
                    </span>
                  )}
                </div>

                {/* Nom du pack */}
                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-[#00A3FF] transition-colors duration-300 leading-snug">
                  {pack.name}
                </h3>

                {/* Stack Technique */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {pack.stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 group-hover:border-[#00A3FF]/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pied de carte : Mentor & CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <UserBadgeIcon />
                  <span>{pack.lead}</span>
                </div>
                <Link
                  href={`/formations/${pack.slug}`}
                  className="flex items-center gap-1 text-xs font-semibold text-[#00A3FF] group-hover:translate-x-1 transition-transform duration-300"
                >
                  <span>Souscrire</span>
                  <ArrowRightIcon />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Garanties / Infos additionnelles */}
        <motion.div 
          className="mt-16 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 text-xs md:text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            <span>Projets 100% pratiques</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            <span>Suivi personnalisé</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            <span>Attestation de fin de parcours</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}