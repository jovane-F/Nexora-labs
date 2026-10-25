import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { CLASS_MAX_STUDENTS } from "@/lib/classes";
import { CALL_MONTHLY_LIMIT_MINUTES, CALL_MONTHLY_WARNING_MINUTES, monthlyUsageMinutes } from "@/lib/classroom";
import ClassRoom from "@/components/classroom/classroom";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ACTIVE: "Confirmé",
  COMPLETED: "Terminé",
};

export default async function AdminClassPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const admin = await requireAdmin();

  const { sessionId: rawId } = await params;
  if (!/^\d+$/.test(rawId)) notFound();
  const sessionId = Number(rawId);

  const academySession = await prisma.academySession.findUnique({
    where: { id: sessionId },
    select: { title: true, packId: true, liveScheduleInfo: true },
  });
  if (!academySession) notFound();

  const pack = await prisma.pack.findUnique({ where: { id: academySession.packId }, select: { title: true } });

  const enrollments = (
    await prisma.enrollment.findMany({
      where: { sessionId },
      orderBy: { id: "asc" },
      select: { studentId: true, status: true },
    })
  ).filter((e) => String(e.status) !== "CANCELLED");

  const students = await prisma.user.findMany({
    where: { id: { in: enrollments.map((e) => e.studentId) } },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
  });
  const studentById = new Map(students.map((u) => [u.id, u]));

  const instructor = await prisma.instructor.findUnique({ where: { userId: admin.id }, select: { id: true } });
  const usage = instructor ? await monthlyUsageMinutes(instructor.id) : 0;

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClassRoom
            sessionId={sessionId}
            title={academySession.title}
            me={{ id: admin.id.toString() }}
            isAdmin
            initialUsageMinutes={usage}
            limitMinutes={CALL_MONTHLY_LIMIT_MINUTES}
            warningMinutes={CALL_MONTHLY_WARNING_MINUTES}
            backHref="/dashboard/admin/classes"
            backLabel="Toutes les classes"
          />
        </div>

        <aside className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 h-fit space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">{pack?.title ?? "Pack"}</p>
            <p className="text-sm font-bold text-white">
              Étudiants · {enrollments.length}/{CLASS_MAX_STUDENTS}
            </p>
            <p className="text-xs text-gray-400 mt-1">{academySession.liveScheduleInfo ?? "Horaires à définir"}</p>
          </div>

          {enrollments.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun étudiant dans cette classe.</p>
          ) : (
            <ul className="space-y-3">
              {enrollments.map((e) => {
                const student = studentById.get(e.studentId);
                const status = String(e.status);
                return (
                  <li key={e.studentId.toString()} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-200 font-medium">{student ? `${student.firstName} ${student.lastName}` : "Utilisateur"}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          status === "PENDING"
                            ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                            : "text-green-400 bg-green-400/10 border-green-400/30"
                        }`}
                      >
                        {statusLabels[status] ?? status}
                      </span>
                    </div>
                    {student && (
                      <p className="text-xs text-gray-500">
                        {student.email}
                        {student.phone ? ` · ${student.phone}` : ""}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <Link href="/dashboard/admin" className="block text-xs font-semibold text-[#00A3FF] hover:underline">
            Valider des paiements →
          </Link>
        </aside>
      </div>
    </main>
  );
}