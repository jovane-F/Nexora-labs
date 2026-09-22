"use client";

import { motion, Variants } from "framer-motion";

// === ICÔNES ===
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

// === DONNÉES DE DÉMONSTRATION ===
const sessions = [
  { day: "Lundi", time: "18h00 - 20h00", topic: "React — Gestion d'état & hooks", live: true },
  { day: "Mercredi", time: "18h00 - 20h00", topic: "Next.js — App Router", live: false },
  { day: "Vendredi", time: "18h00 - 20h00", topic: "Atelier pratique en groupe", live: false },
];

const assignments = [
  { title: "TP — Composant de navigation", due: "Lundi 28 sept.", status: "à rendre" as const },
  { title: "TP — Formulaire contrôlé", due: "Il y a 3 jours", status: "rendu" as const },
  { title: "TP — Consommation d'API", due: "Il y a 8 jours", status: "noté" as const, note: "16/20" },
];

const library = [
  { module: "Mois 1 — Fondamentaux React", type: "Vidéo", title: "Composants & hooks", locked: false },
  { module: "Mois 1 — Fondamentaux React", type: "Support PDF", title: "Fiche récap Tailwind CSS", locked: false },
  { module: "Mois 2 — Next.js en profondeur", type: "Vidéo", title: "App Router & Server Components", locked: false },
  { module: "Mois 3 — Projet final", type: "Support PDF", title: "Cahier des charges du projet", locked: true },
];

const statusStyles: Record<(typeof assignments)[number]["status"], string> = {
  "à rendre": "text-[#00A3FF] bg-[#00A3FF]/10 border-[#00A3FF]/30",
  rendu: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  noté: "text-green-400 bg-green-400/10 border-green-400/30",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } },
};

export default function StudentDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-3">
            Espace étudiant
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Bonjour 👋</h1>
              <p className="text-gray-400 text-sm mt-2">
                Pack en cours : <span className="text-white font-semibold">Next.js Pro</span> — Mois 2 sur 3
              </p>
            </div>
            <div className="w-full sm:w-56">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span>Progression</span>
                <span>58%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "58%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-[#00A3FF] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planning */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-1 p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-fit"
          >
            <div className="flex items-center gap-2.5 mb-5 text-white">
              <CalendarIcon />
              <h2 className="text-base font-bold">Planning de la semaine</h2>
            </div>
            <div className="space-y-3">
              {sessions.map((s) => (
                <motion.div
                  key={s.day}
                  variants={itemVariants}
                  className={`p-4 rounded-xl border ${
                    s.live ? "border-[#00A3FF]/50 bg-[#00A3FF]/10" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-white">{s.day}</span>
                    {s.live && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#00A3FF]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse" />
                        Prochain
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{s.time}</p>
                  <p className="text-xs text-gray-300 mt-1">{s.topic}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Devoirs & rendus */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-1 p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-fit"
          >
            <div className="flex items-center gap-2.5 mb-5 text-white">
              <FileIcon />
              <h2 className="text-base font-bold">Devoirs & rendus</h2>
            </div>
            <div className="space-y-3">
              {assignments.map((a) => (
                <motion.div key={a.title} variants={itemVariants} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-gray-200 leading-snug">{a.title}</p>
                    <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {a.status === "à rendre" ? "À rendre le " : "Rendu — "}
                    {a.due}
                    {a.note ? ` · ${a.note}` : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bibliothèque de cours */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-1 p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-fit"
          >
            <div className="flex items-center gap-2.5 mb-5 text-white">
              <PlayIcon />
              <h2 className="text-base font-bold">Vidéos & supports</h2>
            </div>
            <div className="space-y-3">
              {library.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className={`p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 ${
                    item.locked ? "opacity-50" : "hover:border-[#00A3FF]/40 transition-colors cursor-pointer"
                  }`}
                >
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">{item.module}</p>
                    <p className="text-sm text-gray-200">{item.title}</p>
                    <span className="text-[11px] text-[#00A3FF]">{item.type}</span>
                  </div>
                  {item.locked && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-500">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}