"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const formations = [
  {
    title: "Développement Frontend Moderne",
    duration: "3 Mois",
    level: "Débutant à Intermédiaire",
    topics: ["HTML/CSS", "JavaScript ES6+", "React.js", "Tailwind CSS"],
    status: "Inscriptions ouvertes",
  },
  {
    title: "Fullstack Next.js & Architecture Web",
    duration: "3 Mois",
    level: "Avancé",
    topics: ["Next.js App Router", "TypeScript", "Prisma / SQL", "Déploiement Vercel"],
    status: "Prochaine session",
  },
  {
    title: "Design UI/UX & Prototypage Pro",
    duration: "2 Mois",
    level: "Tous niveaux",
    topics: ["Figma Pro", "Wireframing", "Design Systems", "User Research"],
    status: "Bientôt disponible",
  },
];

export default function FormationsPage() {
  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-32 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold">
            Nexora Academy
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4">
            Formez-vous aux métiers du <br />
            <span className="text-[#00A3FF]">développement & du design</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {formations.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between backdrop-blur-md relative overflow-hidden"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#00A3FF]/20 text-[#00A3FF] text-xs font-bold mb-4">
                  {f.status}
                </span>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-xs text-gray-400 mb-6">
                  Durée: <span className="text-white font-semibold">{f.duration}</span> • Niveau: <span className="text-white font-semibold">{f.level}</span>
                </p>

                <div className="space-y-2 mb-8">
                  <p className="text-xs font-semibold text-gray-300">Programme clé :</p>
                  {f.topics.map((t, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-[#00A3FF]">•</span> {t}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/devis"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#00A3FF] text-center font-bold text-sm transition duration-300 block"
              >
                S'inscrire à la formation
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}