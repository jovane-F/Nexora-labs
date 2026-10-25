import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { CLASS_MAX_STUDENTS } from "@/lib/classes";
import { CALL_MONTHLY_LIMIT_MINUTES, monthlyUsageMinutes } from "@/lib/classroom";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const formatDate = (d?: Date | null) => (d ? dateFormat.format(d) : "à définir");
const formatMinutes = (total: number) => `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, "0")}`;

export default async function AdminClassesPage() {
  const admin = await requireAdmin();

  const sessions = await prisma.academySession.findMany({
    orderBy: [{ packId: "asc" }, { id: "asc" }],
    select: { id: true, packId: true, title: true, startDate: true, endDate: true, isOpenForEnrollment: true },
  });

  const packs = await prisma.pack.findMany({
    where: { id: { in: Array.from(new Set(sessions.map((s) => s.packId))) } },
    select: { id: true, title: true },
  });
  const packById = new Map(packs.map((p) => [p.id, p.title]));

  const enrollments = (
    await prisma.enrollment.findMany({
      where: { sessionId: { in: sessions.map((s) => s.id) } },
      select: { sessionId: true, status: true },
    })
  ).filter((e) => String(e.status) !== "CANCELLED");

  // Classes où un cours audio est en cours
  const activeCalls = await prisma.audio_calls.findMany({ where: { status: "ACTIVE" }, select: { room_id: true } });
  const liveRooms = await prisma.chat_rooms.findMany({
    where: { id: { in: activeCalls.map((c) => c.room_id) } },
    select: { session_id: true },
  });
  const liveSessionIds = new Set(liveRooms.flatMap((r) => (r.session_id === null ? [] : [r.session_id])));

  const instructor = await prisma.instructor.findUnique({ where: { userId: admin.id }, select: { id: true } });
  const usage = instructor ? await monthlyUsageMinutes(instructor.id) : 0;

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/dashboard/admin" className="inline-flex text-sm text-gray-400 hover:text-[#00A3FF] transition-colors mb-4">
          ← Paiements
        </Link>
        <span className="block w-fit px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-3">
          Administration
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Classes et cours en ligne</h1>
        <p className="text-gray-400 text-sm mb-8">
          Cours audio ce mois-ci : <span className="text-white font-semibold">{formatMinutes(usage)}</span> sur {formatMinutes(CALL_MONTHLY_LIMIT_MINUTES)}.
        </p>

        {sessions.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune classe pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const count = enrollments.filter((e) => e.sessionId === s.id).length;
              const live = liveSessionIds.has(s.id);
              return (
                <Link
                  key={s.id}
                  href={`/dashboard/admin/classes/${s.id}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00A3FF]/40 transition-colors"
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{packById.get(s.packId) ?? "Pack"}</p>
                    <p className="text-base font-bold text-white">{s.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Du {formatDate(s.startDate)} au {formatDate(s.endDate)}
                      {s.isOpenForEnrollment ? "" : " · inscriptions fermées"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {live && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Cours en cours
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        count > CLASS_MAX_STUDENTS
                          ? "text-red-300 bg-red-400/10 border-red-400/30"
                          : "text-gray-300 bg-white/5 border-white/10"
                      }`}
                    >
                      {count}/{CLASS_MAX_STUDENTS} étudiants
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}