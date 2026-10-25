import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dashboardPathForRole, getSession } from "@/lib/session";
import { METHOD_LABELS, PAYMENT_TYPE_LABELS, formatAmount, type PayMethod } from "@/lib/payment";
import AdminPayments, { type PendingPaymentRow } from "@/components/dashboard/AdminPayments";

export const dynamic = "force-dynamic";

const dateTimeFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    redirect("/connexion?espace=admin");
  }

  const admin = await prisma.user.findUnique({
    where: { id: BigInt(session.uid) },
    select: { firstName: true, role: true, isActive: true },
  });
  if (!admin || !admin.isActive) {
    redirect("/connexion?espace=admin");
  }
  if (String(admin.role) !== "ADMIN") {
    redirect(dashboardPathForRole(String(admin.role)));
  }

  const pending = await prisma.payment.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      userId: true,
      enrollmentId: true,
      amount: true,
      method: true,
      type: true,
      transactionReference: true,
      createdAt: true,
    },
  });

  const users = await prisma.user.findMany({
    where: { id: { in: pending.map((p) => p.userId) } },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  const enrollmentIds = pending.flatMap((p) => (p.enrollmentId === null ? [] : [p.enrollmentId]));
  const enrollments = await prisma.enrollment.findMany({
    where: { id: { in: enrollmentIds } },
    select: { id: true, sessionId: true },
  });
  const enrollmentById = new Map(enrollments.map((e) => [e.id, e]));

  const sessions = await prisma.academySession.findMany({
    where: { id: { in: enrollments.map((e) => e.sessionId) } },
    select: { id: true, packId: true },
  });
  const sessionById = new Map(sessions.map((s) => [s.id, s]));

  const packs = await prisma.pack.findMany({
    where: { id: { in: sessions.map((s) => s.packId) } },
    select: { id: true, title: true },
  });
  const packById = new Map(packs.map((p) => [p.id, p]));

  const rows: PendingPaymentRow[] = pending.map((p) => {
    const user = userById.get(p.userId);
    const enrollment = p.enrollmentId === null ? undefined : enrollmentById.get(p.enrollmentId);
    const academySession = enrollment ? sessionById.get(enrollment.sessionId) : undefined;
    const pack = academySession ? packById.get(academySession.packId) : undefined;
    const method = String(p.method);

    return {
      id: p.id.toString(),
      reference: p.transactionReference,
      studentName: user ? `${user.firstName} ${user.lastName}` : "Utilisateur inconnu",
      email: user?.email ?? "",
      phone: user?.phone ?? null,
      packTitle: pack?.title ?? "Pack inconnu",
      typeLabel: PAYMENT_TYPE_LABELS[String(p.type)] ?? String(p.type),
      methodLabel: METHOD_LABELS[method as PayMethod] ?? method,
      amountLabel: formatAmount(Number(p.amount)),
      createdLabel: dateTimeFormat.format(p.createdAt),
    };
  });

  return <AdminPayments firstName={admin.firstName} rows={rows} />;
} 