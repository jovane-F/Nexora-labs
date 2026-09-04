"use client";

import { motion, Variants } from "framer-motion";

// === ICÔNES SVG SUR-MESURE ===
function CodeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m2.699 2.7a14.96 14.96 0 004.8-1.06" />
    </svg>
  );
}

// === DONNÉES DES SERVICES ===
const services = [
  {
    title: "Développement Web & Mobile",
    description: "Création d'applications modernes, réactives et performantes sur-mesure (React, Next.js, Mobile).",
    icon: <CodeIcon />,
    badge: "Sur-Mesure",
  },
  {
    title: "Formation en Ligne",
    description: "Parcours de 3 mois axés sur la pratique pour maîtriser les technologies web actuelles.",
    icon: <GraduationIcon />,
    badge: "Nexora Academy",
  },
  {
    title: "Solutions Web & Maintenance",
    description: "Audit, optimisation, sécurisation et gestion d'infrastructure web pour vos projets.",
    icon: <GearIcon />,
    badge: "Cloud & Sécurité",
  },
  {
    title: "Community Management & Design",
    description: "Gestion de votre image de marque, réseaux sociaux et création de supports visuels d'impact.",
    icon: <RocketIcon />,
    badge: "Branding",
  },
];

// === VARIANTS D'ANIMATION (TYPÉS) ===
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

export default function ServicesOverview() {
  return (
    <section id="services" className="py-24 bg-[#0B0E17] px-6 relative overflow-hidden">
      {/* Halo de fond subtil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00A3FF]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* En-tête */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-4">
            Nos Expertises
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Nos Domaines d'Expertise
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Des solutions numériques complètes pour propulser votre entreprise et former les talents de demain.
          </p>
        </motion.div>

        {/* Grille de cartes */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((s, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="relative group rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-7 border border-white/10 hover:border-[#00A3FF]/50 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Reflet néon au survol (Halo interne) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00A3FF]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                {/* En-tête Carte : Icône + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-[#00A3FF]/10 border border-[#00A3FF]/30 flex items-center justify-center text-[#00A3FF] group-hover:bg-[#00A3FF] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(0,163,255,0.6)] transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {s.icon}
                  </motion.div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                    {s.badge}
                  </span>
                </div>

                {/* Titre & Description */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00A3FF] transition-colors duration-300 leading-snug">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {s.description}
                </p>
              </div>

              {/* Pied de carte : Lien d'action */}
              <div className="pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-[#00A3FF] group-hover:translate-x-1 transition-transform duration-300">
                En savoir plus <span className="ml-1.5">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}