"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// === TYPES (remplis côté serveur par app/dashboard/etudiant/page.tsx) ===
export type AssignmentStatus = "à rendre" | "en retard" | "rendu" | "noté";

export type PaymentAction = "pay" | "pay_second" | "verifying" | "none";

export type DashboardPack = {
  enrollmentId: string;
  status: string;
  unlocked: boolean;
  classe: { size: number; max: number; mates: string[] };
  payment: {
    action: PaymentAction;
    pendingReference: string | null;
    lastRejected: boolean;
  };
  pack: { id: number; title: string; slug: string };
  session: {
    title: string;
    startLabel: string;
    endLabel: string;
    liveScheduleInfo: string;
    communityGroupLink: string | null;
    phase: "upcoming" | "running" | "finished";
    progress: number;
  };
  courses: {
    id: number;
    title: string;
    description: string | null;
    resources: { id: number; title: string; type: string; url: string | null }[];
  }[];
  assignments: {
    id: number;
    title: string;
    dueLabel: string;
    status: AssignmentStatus;
    grade: string | null;
  }[];
};

export type DashboardData = { firstName: string; packs: DashboardPack[] };

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

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gray-500">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// === LIBELLÉS ===
const assignmentStyles: Record<AssignmentStatus, string> = {
  "à rendre": "text-[#00A3FF] bg-[#00A3FF]/10 border-[#00A3FF]/30",
  "en retard": "text-red-400 bg-red-400/10 border-red-400/30",
  rendu: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  noté: "text-green-400 bg-green-400/10 border-green-400/30",
};

const enrollmentLabels: Record<string, string> = {
  PENDING: "En attente de confirmation",
  ACTIVE: "Inscription active",
  COMPLETED: "Terminé",
};

const resourceLabels: Record<string, string> = {
  VIDEO: "Vidéo",
  PDF: "Support PDF",
  LINK: "Lien",
  REPLAY_LIVE: "Replay du live",
};

const phaseLabels = {
  upcoming: "La session n'a pas encore commencé",
  running: "Avancement de la session",
  finished: "Session terminée",
} as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } },
};

const cardClass = "lg:col-span-1 p-6 rounded-2xl bg-white/[0.03] border border-white/10 h-fit";

const payButtonClass =
  "inline-flex shrink-0 items-center justify-center px-5 py-2.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-xs shadow-[0_0_20px_rgba(0,163,255,0.4)] transition duration-300";

function PaymentNotice({ pack }: { pack: DashboardPack }) {
  const payUrl = `/paiement/${pack.enrollmentId}`;
  const { action, pendingReference, lastRejected } = pack.payment;
  const box = "mb-6 p-4 rounded-xl border text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3";

  if (action === "verifying") {
    return (
      <div className={`${box} bg-yellow-400/10 border-yellow-400/30 text-yellow-300`}>
        <p>
          Ton paiement est en cours de vérification par l'équipe
          {pendingReference ? ` (référence ${pendingReference})` : ""}. Tes supports se débloqueront dès sa validation.
        </p>
        <Link href={payUrl} className="shrink-0 text-xs font-semibold underline underline-offset-2">
          Revoir ma référence et le QR code
        </Link>
      </div>
    );
  }

  if (action === "pay") {
    return (
      <div className={`${box} bg-yellow-400/10 border-yellow-400/30 text-yellow-300`}>
        <p>
          {lastRejected
            ? "Ton dernier paiement n'a pas pu être validé. Tu peux refaire une demande."
            : "Ton inscription est en attente. Règle ce pack pour débloquer les supports de cours et le groupe de ta promotion."}
        </p>
        <Link href={payUrl} className={payButtonClass}>
          Payer ce pack
        </Link>
      </div>
    );
  }

  if (action === "pay_second") {
    return (
      <div className={`${box} bg-[#00A3FF]/10 border-[#00A3FF]/30 text-[#7CCBFF]`}>
        <p>
          {lastRejected
            ? "Le paiement de ta 2e tranche n'a pas pu être validé. Tu peux refaire une demande."
            : "Ta 1re tranche est validée. Il te reste la 2e tranche à régler."}
        </p>
        <Link href={payUrl} className={payButtonClass}>
          Payer la 2e tranche
        </Link>
      </div>
    );
  }

  if (!pack.unlocked) {
    return (
      <div className={`${box} bg-yellow-400/10 border-yellow-400/30 text-yellow-300`}>
        <p>Ton inscription à ce pack est en attente de confirmation par l'équipe.</p>
      </div>
    );
  }

  return null;
}

export default function StudentDashboard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/connexion?espace=etudiant");
      router.refresh();
    }
  }

  const current = data.packs[selected] ?? null;

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* En-tête */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider">
              Espace étudiant
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
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Bonjour {data.firstName} 👋</h1>
          <p className="text-gray-400 text-sm mt-2">
            {data.packs.length === 0
              ? "Tu n'es inscrit à aucun pack pour le moment."
              : `Tu es inscrit à ${data.packs.length} pack${data.packs.length > 1 ? "s" : ""}.`}
          </p>
        </motion.div>

        {/* Aucun pack */}
        {!current && (
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center max-w-lg mx-auto">
            <p className="text-gray-300 mb-5">
              Choisis un pack de formation pour accéder à ton planning, tes devoirs et tes supports de cours.
            </p>
            <Link
              href="/formations"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-sm shadow-[0_0_25px_rgba(0,163,255,0.5)] transition duration-300"
            >
              Voir les packs
            </Link>
          </div>
        )}

        {current && (
          <>
            {/* Sélecteur de pack (si plusieurs inscriptions) */}
            {data.packs.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {data.packs.map((p, i) => (
                  <button
                    key={p.enrollmentId}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors duration-300 ${
                      i === selected
                        ? "bg-[#00A3FF] border-[#00A3FF] text-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    {p.pack.title}
                  </button>
                ))}
              </div>
            )}

            {/* Résumé du pack sélectionné */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">
                  Pack : <span className="text-white font-semibold">{current.pack.title}</span>
                </p>
                <span
                  className={`inline-block mt-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    current.unlocked
                      ? "text-green-400 bg-green-400/10 border-green-400/30"
                      : "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                  }`}
                >
                  {enrollmentLabels[current.status] ?? current.status}
                </span>
                <Link
                  href={`/dashboard/etudiant/programme/${current.enrollmentId}`}
                  className="ml-3 inline-block mt-2 text-[11px] font-semibold text-[#00A3FF] hover:underline"
                >
                  Voir le programme du pack →
                </Link>
              </div>
              <div className="w-full sm:w-64">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>{phaseLabels[current.session.phase]}</span>
                  {current.session.phase === "running" && <span>{current.session.progress}%</span>}
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    key={current.enrollmentId}
                    initial={{ width: 0 }}
                    animate={{ width: `${current.session.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[#00A3FF] rounded-full"
                  />
                </div>
              </div>
            </div>

            <PaymentNotice pack={current} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" key={current.enrollmentId}>
              {/* Ma session */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className={cardClass}>
                <div className="flex items-center gap-2.5 mb-5 text-white">
                  <CalendarIcon />
                  <h2 className="text-base font-bold">Ma session</h2>
                </div>
                <motion.div variants={itemVariants} className="p-4 rounded-xl border border-[#00A3FF]/40 bg-[#00A3FF]/10 space-y-2">
                  <p className="text-sm font-semibold text-white">{current.session.title}</p>
                  <p className="text-xs text-gray-300">
                    Du {current.session.startLabel} au {current.session.endLabel}
                  </p>
                  <p className="text-xs text-gray-400">{current.session.liveScheduleInfo}</p>
                </motion.div>
                {current.session.communityGroupLink && (
                  <motion.a
                    variants={itemVariants}
                    href={current.session.communityGroupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                  >
                    Rejoindre le groupe de la promotion
                  </motion.a>
                )}
                <motion.div variants={itemVariants} className="mt-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                  <p className="text-xs font-semibold text-gray-300">
                    Ma classe · {current.classe.size}/{current.classe.max} places
                  </p>
                  {current.classe.mates.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {current.classe.mates.map((name) => (
                        <span key={name} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500">D'autres étudiants du même pack te rejoindront ici.</p>
                  )}
                  {current.unlocked ? (
                    <Link
                      href={`/classe/${current.enrollmentId}`}
                      className="inline-flex items-center justify-center mt-1 px-4 py-2 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-xs shadow-[0_0_20px_rgba(0,163,255,0.4)] transition duration-300"
                    >
                      Ouvrir la salle de classe
                    </Link>
                  ) : (
                    <p className="text-[11px] text-gray-500">La salle de classe s'ouvre dès que ton inscription est confirmée.</p>
                  )}
                </motion.div>
              </motion.div>

              {/* Devoirs & rendus */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className={cardClass}>
                <div className="flex items-center gap-2.5 mb-5 text-white">
                  <FileIcon />
                  <h2 className="text-base font-bold">Devoirs & rendus</h2>
                </div>
                {current.assignments.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucun devoir pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {current.assignments.map((a) => (
                      <motion.div key={a.id} variants={itemVariants} className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm text-gray-200 leading-snug">{a.title}</p>
                          <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${assignmentStyles[a.status]}`}>
                            {a.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Pour le {a.dueLabel}
                          {a.grade ? ` · Note : ${a.grade}` : ""}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Vidéos & supports */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className={cardClass}>
                <div className="flex items-center gap-2.5 mb-5 text-white">
                  <PlayIcon />
                  <h2 className="text-base font-bold">Vidéos & supports</h2>
                </div>
                {current.courses.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Les cours de ce pack seront publiés par ton formateur au fil de la session.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {current.courses.map((course) => (
                      <div key={course.id}>
                        <p className="text-xs font-semibold text-gray-300 mb-2">{course.title}</p>
                        {course.resources.length === 0 ? (
                          <p className="text-xs text-gray-500">Aucun support publié pour l'instant.</p>
                        ) : (
                          <div className="space-y-2">
                            {course.resources.map((r) => {
                              const label = resourceLabels[r.type] ?? r.type;
                              const inner = (
                                <>
                                  <div>
                                    <p className="text-sm text-gray-200">{r.title}</p>
                                    <span className="text-[11px] text-[#00A3FF]">{label}</span>
                                  </div>
                                  {!r.url && <LockIcon />}
                                </>
                              );
                              return r.url ? (
                                <motion.a
                                  key={r.id}
                                  variants={itemVariants}
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 hover:border-[#00A3FF]/40 transition-colors"
                                >
                                  {inner}
                                </motion.a>
                              ) : (
                                <motion.div
                                  key={r.id}
                                  variants={itemVariants}
                                  className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 opacity-50"
                                >
                                  {inner}
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}