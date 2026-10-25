import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { CALL_MONTHLY_LIMIT_MINUTES, CALL_MONTHLY_WARNING_MINUTES } from "@/lib/classroom";
import ClassRoom from "@/components/classroom/classroom";

export const dynamic = "force-dynamic";

export default async function StudentClassPage({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;

  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    redirect("/connexion?espace=etudiant");
  }
  if (!/^\d+$/.test(enrollmentId)) notFound();

  // Seul l'étudiant inscrit peut ouvrir cette salle, et seulement une fois son inscription confirmée.
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: BigInt(enrollmentId), studentId: BigInt(session.uid) },
    select: { sessionId: true, status: true },
  });
  if (!enrollment) notFound();
  if (!["ACTIVE", "COMPLETED"].includes(String(enrollment.status))) redirect("/dashboard/etudiant");

  const academySession = await prisma.academySession.findUnique({
    where: { id: enrollment.sessionId },
    select: { title: true },
  });
  if (!academySession) notFound();

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00A3FF]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <ClassRoom
          sessionId={enrollment.sessionId}
          title={academySession.title}
          me={{ id: session.uid }}
          isAdmin={false}
          initialUsageMinutes={0}
          limitMinutes={CALL_MONTHLY_LIMIT_MINUTES}
          warningMinutes={CALL_MONTHLY_WARNING_MINUTES}
          backHref="/dashboard/etudiant"
          backLabel="Retour à mon espace"
        />
      </div>
    </main>
  );
}