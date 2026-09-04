"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    title: "Développement Web Sur-Mesure",
    desc: "Création de sites vitrines, applications web et plateformes e-commerce ultra-rapides et sécurisées.",
    icon: "💻",
    tags: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Design UI/UX & Branding",
    desc: "Interfaces modernes, identités visuelles uniques et prototypes interactifs axés sur la conversion.",
    icon: "🎨",
    tags: ["Figma", "Prototypage", "Design System"],
  },
  {
    title: "Applications Mobiles & SaaS",
    desc: "Solutions logicielles complètes avec architectures évolutives et gestion de bases de données.",
    icon: "🚀",
    tags: ["Fullstack", "API REST", "Cloud"],
  },
  {
    title: "SEO & Performance",
    desc: "Optimisation du référencement naturel, temps de chargement éclair et stratégie de présence digitale.",
    icon: "⚡",
    tags: ["Analytics", "Core Web Vitals", "SEO"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-32 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold">
            Nos Expertises
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4">
            Des services conçus pour <br />
            <span className="text-[#00A3FF]">propulser votre entreprise</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00A3FF]/50 transition duration-300 backdrop-blur-md flex flex-col justify-between group"
            >
              <div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[#00A3FF] transition">
                  {s.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-6">
                  {s.desc}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {s.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href="/devis"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#00A3FF] hover:underline"
                >
                  Commander ce service →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}