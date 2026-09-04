"use client";

import { motion, Variants } from "framer-motion";

// === ICÔNES SVG SUR-MESURE POUR NEXORA ===

// Développement Web & Sur-Mesure
function CodeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 shrink-0"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

// Design UI/UX & Branding
function DesignIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 shrink-0"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

// Formations & Mentorat
function AcademicIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 shrink-0"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

// Conception & Architecture Système
function ArchitectureIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 shrink-0"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  );
}

// === OFFRES NÉXORA LABS ===
const services = [
  {
    id: "01",
    title: "Développement Web",
    desc: "Applications Web sur-mesure, plateformes SaaS modernes & sites hautes performances (Next.js, React, PHP).",
    Icon: CodeIcon,
  },
  {
    id: "02",
    title: "UI/UX & Branding",
    desc: "Conception d'interfaces web captivantes, maquettes Figma & création d'identités visuelles percutantes.",
    Icon: DesignIcon,
  },
  {
    id: "03",
    title: "Formations & Accompagnement",
    desc: "Parcours intensifs de 3 mois pour former vos équipes aux meilleures technologies du marché.",
    Icon: AcademicIcon,
  },
  {
    id: "04",
    title: "Conception & Architecture",
    desc: "Rédaction de cahiers des charges, modélisation UML/Merise & structuration de bases de données robustes.",
    Icon: ArchitectureIcon,
  },
];

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

export default function ServicesGrid() {
  return (
    <section className="py-20 px-6 bg-[#0B0E17] relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-3">
            Nos Domaines d'Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ce que Nexora conçoit pour vous
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Des solutions digitales complètes, de la conception architecturale jusqu'au déploiement et à la montée en compétences.
          </p>
        </div>

        {/* Grille des services */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((s) => {
            const Icon = s.Icon;
            return (
              <motion.div
                key={s.id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  borderColor: "rgba(0,163,255,0.5)",
                  boxShadow: "0px 10px 30px rgba(0,163,255,0.15)",
                }}
                className="relative p-6 rounded-2xl bg-[#121621] border border-white/10 transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* En-tête : Icône + Badge ID */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#00A3FF]/10 border border-[#00A3FF]/30 flex items-center justify-center text-[#00A3FF] group-hover:bg-[#00A3FF] group-hover:text-black transition-all duration-300">
                      <Icon />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#00A3FF]/70 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                      {s.id}
                    </span>
                  </div>

                  {/* Titre & Description */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00A3FF] transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Bouton d'action */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end">
                  <span className="text-xs font-semibold text-[#00A3FF] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    En savoir plus →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}