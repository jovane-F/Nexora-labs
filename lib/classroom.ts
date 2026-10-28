import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const CALL_MAX_MINUTES = 240; // un cours audio est coupé automatiquement après 4 h
export const CALL_MONTHLY_LIMIT_MINUTES = 25 * 60; // quota par formateur et par mois
export const CALL_MONTHLY_WARNING_MINUTES = 35 * 60;
export const MESSAGE_MAX_LENGTH = 2000; 

export type ClassroomUser = { id: bigint; firstName: string; lastName: string; isAdmin: boolean };

export type Access =
  | { ok: true; user: ClassroomUser; sessionTitle: string }
  | { ok: false; status: 401 | 403 | 404; error: string };

/**
 * Qui peut entrer dans la salle d'une classe ?
 *  - un administrateur (les formateurs sont les administrateurs) ;
 *  - un étudiant dont l'inscription à CETTE classe est confirmée (ACTIVE ou COMPLETED).
 * Le rôle est relu en base à chaque appel : le cookie seul ne suffit pas.
 */
export async function authorizeClassroom(sessionId: number): Promise<Access> {
  const session = await getSession();
  if (!session || !/^\d+$/.test(session.uid)) {
    return { ok: false, status: 401, error: "Connecte-toi pour accéder à la classe." };
  }
  const userId = BigInt(session.uid);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) {
    return { ok: false, status: 401, error: "Connecte-toi pour accéder à la classe." };
  }

  const academySession = await prisma.academySession.findUnique({
    where: { id: sessionId },
    select: { title: true },
  });
  if (!academySession) {
    return { ok: false, status: 404, error: "Classe introuvable." };
  }

  const role = String(user.role);
  const me = { id: userId, firstName: user.firstName, lastName: user.lastName };

  if (role === "ADMIN") {
    return { ok: true, user: { ...me, isAdmin: true }, sessionTitle: academySession.title };
  }

  if (role === "STUDENT") {
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: userId, sessionId, status: { in: ["ACTIVE", "COMPLETED"] } },
      select: { id: true },
    });
    if (enrollment) {
      return { ok: true, user: { ...me, isAdmin: false }, sessionTitle: academySession.title };
    }
    return {
      ok: false,
      status: 403,
      error: "Ton inscription à cette classe doit d'abord être confirmée.",
    };
  }

  return { ok: false, status: 403, error: "Accès refusé." };
}

/** Une salle de discussion par classe, créée à la première visite. */
export async function getOrCreateRoom(sessionId: number, name: string): Promise<bigint> {
  const existing = await prisma.chat_rooms.findFirst({ where: { session_id: sessionId }, select: { id: true } });
  if (existing) return existing.id;

  return prisma.$transaction(async (tx) => {
    // Verrou sur la classe : deux premières visites simultanées ne créent qu'une seule salle.
    await tx.$queryRaw<{ id: number }[]>`SELECT id FROM academy_sessions WHERE id = ${sessionId} FOR UPDATE`;
    const again = await tx.chat_rooms.findFirst({ where: { session_id: sessionId }, select: { id: true } });
    if (again) return again.id;
    const created = await tx.chat_rooms.create({
      data: { session_id: sessionId, name: name.slice(0, 150) },
      select: { id: true },
    });
    return created.id;
  });
}

/** Cours audio en cours pour cette salle. Un cours oublié ouvert est clôturé automatiquement après 4 h. */
export async function getActiveCall(roomId: bigint, now: Date = new Date()) {
  const call = await prisma.audio_calls.findFirst({
    where: { room_id: roomId, status: "ACTIVE" },
    orderBy: { id: "desc" },
    select: { id: true, channel_name: true, instructor_id: true, started_at: true },
  });
  if (!call) return null;

  const startedAt = call.started_at ?? now;
  if (now.getTime() - startedAt.getTime() > CALL_MAX_MINUTES * 60_000) {
    await prisma.audio_calls.update({
      where: { id: call.id },
      data: {
        status: "ENDED",
        ended_at: new Date(startedAt.getTime() + CALL_MAX_MINUTES * 60_000),
        duration_minutes: CALL_MAX_MINUTES,
      },
    });
    return null;
  }

  return { id: call.id, channelName: call.channel_name, instructorId: call.instructor_id, startedAt };
}

/** Minutes de cours consommées : cours terminés + temps écoulé du cours en cours (plafonné). */
export function usageMinutes(
  calls: { status: string | null; started_at: Date | null; duration_minutes: number | null }[],
  now: Date = new Date()
): number {
  let total = 0;
  for (const call of calls) {
    if (call.status === "ACTIVE" && call.started_at) {
      total += Math.min(CALL_MAX_MINUTES, Math.ceil((now.getTime() - call.started_at.getTime()) / 60_000));
    } else {
      total += call.duration_minutes ?? 0;
    }
  }
  return total;
}

/** Minutes de cours audio données par ce formateur depuis le début du mois (UTC). */
export async function monthlyUsageMinutes(instructorId: number, now: Date = new Date()): Promise<number> {
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const calls = await prisma.audio_calls.findMany({
    where: { instructor_id: instructorId, started_at: { gte: monthStart }, status: { in: ["ACTIVE", "ENDED"] } },
    select: { status: true, started_at: true, duration_minutes: true },
  });
  return usageMinutes(
    calls.map((c) => ({ status: c.status === null ? null : String(c.status), started_at: c.started_at, duration_minutes: c.duration_minutes })),
    now
  );
}

/** Nom affiché dans le chat : les administrateurs apparaissent comme formateurs. */
export function displayName(user: { firstName: string; lastName: string; role: string } | undefined): string {
  if (!user) return "Utilisateur";
  return user.role === "ADMIN" ? `${user.firstName} (Formateur)` : `${user.firstName} ${user.lastName.charAt(0)}.`;
}