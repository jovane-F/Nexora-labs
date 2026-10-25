import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dashboardPathForRole, getSession } from "@/lib/session";
import { computePaymentState } from "@/lib/payment";
import { CLASS_MAX_STUDENTS } from "@/lib/classes";
import StudentDashboard, {
  type AssignmentStatus,
  type PaymentAction,
  type DashboardData,
  type DashboardPack,
} from "@/components/dashboard/StudentDashboard";

// Les données dépendent de l'étudiant connecté : jamais de cache partagé.
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** N'autorise que les liens http(s) : évite qu'une URL de type javascript: soit rendue cliquable. */
function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    redirect("/connexion?espace=etudiant");
  }

  const studentId = BigInt(session.uid);

  const user = await prisma.user.findUnique({
    where: { id: studentId },
    select: { firstName: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    redirect("/connexion?espace=etudiant");
  }
  if (String(user.role) !== "STUDENT") {
    redirect(dashboardPathForRole(String(user.role)));
  }

  // 1. Uniquement les inscriptions de CET étudiant
  const enrollments = (
    await prisma.enrollment.findMany({
      where: { studentId },
      orderBy: { enrollmentDate: "asc" },
      select: { id: true, sessionId: true, status: true },
    })
  ).filter((e) => String(e.status) !== "CANCELLED");

  // 2. Leurs sessions, puis les packs de ces sessions
  const sessions = await prisma.academySession.findMany({
    where: { id: { in: enrollments.map((e) => e.sessionId) } },
    select: {
      id: true,
      packId: true,
      title: true,
      startDate: true,
      endDate: true,
      liveScheduleInfo: true,
      communityGroupLink: true,
    },
  });
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  const packIds = Array.from(new Set(sessions.map((s) => s.packId)));

  const packs = await prisma.pack.findMany({
    where: { id: { in: packIds } },
    select: { id: true, title: true, slug: true },
  });
  const packById = new Map(packs.map((p) => [p.id, p]));

  // Ma classe : places occupées dans la session + prénoms des camarades dont l'inscription est confirmée
  const classEnrollments = (
    await prisma.enrollment.findMany({
      where: { sessionId: { in: sessions.map((s) => s.id) } },
      select: { sessionId: true, studentId: true, status: true },
    })
  ).filter((e) => String(e.status) !== "CANCELLED");
  const classmates = await prisma.user.findMany({
    where: { id: { in: classEnrollments.map((e) => e.studentId) } },
    select: { id: true, firstName: true, lastName: true },
  });
  const classmateById = new Map(classmates.map((u) => [u.id, u]));

  // 3. Contenus, devoirs et rendus : seulement ceux de ces packs / sessions
  const courses = await prisma.course.findMany({
    where: { packId: { in: packIds } },
    orderBy: { orderIndex: "asc" },
    select: { id: true, packId: true, title: true, description: true },
  });

  const resources = await prisma.courseResource.findMany({
    where: { courseId: { in: courses.map((c) => c.id) } },
    select: { id: true, courseId: true, title: true, type: true, url: true },
  });

  const assignments = await prisma.assignment.findMany({
    where: { sessionId: { in: sessions.map((s) => s.id) } },
    orderBy: { dueDate: "asc" },
    select: { id: true, sessionId: true, title: true, dueDate: true },
  });

  const submissions = await prisma.studentSubmission.findMany({
    where: { studentId, assignmentId: { in: assignments.map((a) => a.id) } },
    select: { assignmentId: true, grade: true },
  });
  const submissionByAssignment = new Map(submissions.map((s) => [s.assignmentId, s]));

  const payments = await prisma.payment.findMany({
    where: { enrollmentId: { in: enrollments.map((e) => e.id) } },
    select: { enrollmentId: true, status: true, type: true, transactionReference: true },
  });

  const now = Date.now();

  const dashboardPacks: DashboardPack[] = [];

  for (const enrollment of enrollments) {
    const dbSession = sessionById.get(enrollment.sessionId);
    if (!dbSession) continue;
    const pack = packById.get(dbSession.packId);
    if (!pack) continue;

    const status = String(enrollment.status);
    // Tant que l'inscription n'est pas confirmée, les liens des ressources ne sont pas envoyés au navigateur.
    const unlocked = status === "ACTIVE" || status === "COMPLETED";

    const start = dbSession.startDate.getTime();
    const end = dbSession.endDate.getTime();
    const phase = now < start ? "upcoming" : now > end ? "finished" : "running";
    const progress =
      phase === "upcoming" || end <= start
        ? 0
        : phase === "finished"
          ? 100
          : Math.round(((now - start) / (end - start)) * 100);

    // État des paiements de cette inscription → quel bouton afficher
    const enrollmentPayments = payments.filter((p) => p.enrollmentId === enrollment.id);
    const paymentState = computePaymentState(
      enrollmentPayments.map((p) => ({ status: String(p.status), type: String(p.type) }))
    );
    const pendingPayment = enrollmentPayments.find((p) => String(p.status) === "PENDING");

    let paymentAction: PaymentAction;
    if (paymentState.hasPending) paymentAction = "verifying";
    else if (paymentState.nextStep === "done") paymentAction = "none";
    else if (paymentState.nextStep === "second") paymentAction = "pay_second";
    else paymentAction = status === "PENDING" ? "pay" : "none"; // activée à la main : rien à payer

    const classSeats = classEnrollments.filter((e) => e.sessionId === dbSession.id);
    const mates = classSeats
      .filter((e) => e.studentId !== studentId && ["ACTIVE", "COMPLETED"].includes(String(e.status)))
      .flatMap((e) => {
        const mate = classmateById.get(e.studentId);
        return mate ? [`${mate.firstName} ${mate.lastName.charAt(0)}.`] : [];
      });

    dashboardPacks.push({
      enrollmentId: enrollment.id.toString(),
      status,
      unlocked,
      classe: { size: classSeats.length, max: CLASS_MAX_STUDENTS, mates },
      payment: {
        action: paymentAction,
        pendingReference: pendingPayment?.transactionReference ?? null,
        lastRejected: paymentState.lastRejected,
      },
      pack: { id: pack.id, title: pack.title, slug: pack.slug },
      session: {
        title: dbSession.title,
        startLabel: dateFormat.format(dbSession.startDate),
        endLabel: dateFormat.format(dbSession.endDate),
        liveScheduleInfo: dbSession.liveScheduleInfo,
        communityGroupLink: unlocked ? safeUrl(dbSession.communityGroupLink) : null,
        phase,
        progress,
      },
      courses: courses
        .filter((c) => c.packId === pack.id)
        .map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          resources: resources
            .filter((r) => r.courseId === c.id)
            .map((r) => ({
              id: r.id,
              title: r.title,
              type: String(r.type),
              url: unlocked ? safeUrl(r.url) : null,
            })),
        })),
      assignments: assignments
        .filter((a) => a.sessionId === dbSession.id)
        .map((a) => {
          const submission = submissionByAssignment.get(a.id);
          const assignmentStatus: AssignmentStatus = submission
            ? submission.grade
              ? "noté"
              : "rendu"
            : a.dueDate.getTime() < now
              ? "en retard"
              : "à rendre";
          return {
            id: a.id,
            title: a.title,
            dueLabel: dateFormat.format(a.dueDate),
            status: assignmentStatus,
            grade: submission?.grade ?? null,
          };
        }),
    });
  }

  const data: DashboardData = { firstName: user.firstName, packs: dashboardPacks };

  return <StudentDashboard data={data} />;
}