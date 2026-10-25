import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CALL_MAX_MINUTES,
  CALL_MONTHLY_LIMIT_MINUTES,
  CALL_MONTHLY_WARNING_MINUTES,
  authorizeClassroom,
  getActiveCall,
  getOrCreateRoom,
  monthlyUsageMinutes,
} from "@/lib/classroom";
import { createMeetingToken, createRoom, deleteRoom, getRoomUrl } from "@/lib/daily";

type Params = { params: Promise<{ sessionId: string }> };

function dailyFailure(err: unknown) {
  const message = err instanceof Error ? err.message : "";
  if (message.includes("DAILY_API_KEY")) {
    return NextResponse.json(
      { error: "Le service d'appel n'est pas configuré : ajoute DAILY_API_KEY dans le fichier .env." },
      { status: 503 }
    );
  }
  console.error("Daily error:", err);
  return NextResponse.json({ error: "Le service d'appel est indisponible pour le moment. Réessaie." }, { status: 502 });
}

/**
 * Actions sur le cours audio de la classe :
 *  - start (administrateur) : ouvre une salle Daily privée et enregistre le cours (audio_calls) ;
 *  - end   (administrateur) : ferme la salle et enregistre la durée ;
 *  - join  (admin ou étudiant confirmé de la classe) : renvoie le lien personnel pour entrer dans la salle.
 */
export async function POST(request: Request, { params }: Params) {
  const { sessionId: rawId } = await params;
  if (!/^\d+$/.test(rawId)) return NextResponse.json({ error: "Classe invalide." }, { status: 400 });
  const sessionId = Number(rawId);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }
  const action = body.action;
  if (action !== "start" && action !== "end" && action !== "join") {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }

  try {
    const access = await authorizeClassroom(sessionId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

    const roomId = await getOrCreateRoom(sessionId, access.sessionTitle);
    const now = new Date();

    // ---------- Entrer dans le cours ----------
    if (action === "join") {
      const active = await getActiveCall(roomId, now);
      if (!active) return NextResponse.json({ error: "Aucun cours n'est en cours." }, { status: 409 });

      try {
        const roomExpiry = Math.floor(active.startedAt.getTime() / 1000) + CALL_MAX_MINUTES * 60;
        const tokenExpiry = Math.min(Math.floor(now.getTime() / 1000) + 2 * 3600, roomExpiry);
        const [roomUrl, token] = await Promise.all([
          getRoomUrl(active.channelName),
          createMeetingToken({
            roomName: active.channelName,
            userName: access.user.isAdmin
              ? `${access.user.firstName} (Formateur)`
              : `${access.user.firstName} ${access.user.lastName.charAt(0)}.`,
            isOwner: access.user.isAdmin,
            expiresAtUnix: tokenExpiry,
          }),
        ]);
        return NextResponse.json({ url: `${roomUrl}?t=${token}` });
      } catch (err) {
        return dailyFailure(err);
      }
    }

    // ---------- start / end : réservés aux administrateurs ----------
    if (!access.user.isAdmin) {
      return NextResponse.json({ error: "Seul un formateur peut lancer ou terminer un cours." }, { status: 403 });
    }

    if (action === "end") {
      const active = await getActiveCall(roomId, now);
      if (!active) return NextResponse.json({ ended: false });

      const duration = Math.min(CALL_MAX_MINUTES, Math.max(1, Math.ceil((now.getTime() - active.startedAt.getTime()) / 60_000)));
      await prisma.audio_calls.update({
        where: { id: active.id },
        data: { status: "ENDED", ended_at: now, duration_minutes: duration },
      });
      await deleteRoom(active.channelName).catch((err) => console.error("Daily deleteRoom error:", err));

      const usage = await monthlyUsageMinutes(active.instructorId, now);
      return NextResponse.json({ ended: true, durationMinutes: duration, usageMinutes: usage });
    }

    // action === "start"
    const instructor = await prisma.instructor.upsert({
      where: { userId: access.user.id },
      create: { userId: access.user.id, specialty: "Formation" },
      update: {},
      select: { id: true },
    });

    const existing = await getActiveCall(roomId, now);
    if (existing) return NextResponse.json({ started: false, alreadyActive: true });

    const used = await monthlyUsageMinutes(instructor.id, now);
    if (used >= CALL_MONTHLY_LIMIT_MINUTES) {
      return NextResponse.json(
        { error: `Quota mensuel atteint (${CALL_MONTHLY_LIMIT_MINUTES / 60} h de cours audio). Il se renouvelle au début du mois prochain.` },
        { status: 403 }
      );
    }

    const roomName = `nx-${sessionId}-${randomBytes(4).toString("hex")}`;
    try {
      await createRoom(roomName, Math.floor(now.getTime() / 1000) + CALL_MAX_MINUTES * 60 + 60);
    } catch (err) {
      return dailyFailure(err);
    }

    // Verrou sur la salle : deux formateurs qui cliquent en même temps n'ouvrent qu'un seul cours.
    const created = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw<{ id: bigint }[]>`SELECT id FROM chat_rooms WHERE id = ${roomId} FOR UPDATE`;
      const already = await tx.audio_calls.findFirst({
        where: { room_id: roomId, status: "ACTIVE", started_at: { gt: new Date(now.getTime() - CALL_MAX_MINUTES * 60_000) } },
        select: { id: true },
      });
      if (already) return false;
      await tx.audio_calls.create({
        data: { room_id: roomId, instructor_id: instructor.id, channel_name: roomName, status: "ACTIVE", started_at: now },
      });
      return true;
    });

    if (!created) {
      await deleteRoom(roomName).catch(() => undefined); // salle Daily devenue inutile
      return NextResponse.json({ started: false, alreadyActive: true });
    }

    return NextResponse.json({
      started: true,
      usageMinutes: used,
      warning: used >= CALL_MONTHLY_WARNING_MINUTES,
    });
  } catch (err) {
    console.error("Classroom call error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}