import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MESSAGE_MAX_LENGTH, authorizeClassroom, displayName, getActiveCall, getOrCreateRoom } from "@/lib/classroom";

type Params = { params: Promise<{ sessionId: string }> };

async function parseSessionId(params: Params["params"]): Promise<number | null> {
  const { sessionId } = await params;
  return /^\d+$/.test(sessionId) ? Number(sessionId) : null;
}

type ChatRow = { id: bigint; sender_id: bigint; message: string; created_at: Date | null };

async function toMessages(rows: ChatRow[]) {
  const senders = await prisma.user.findMany({
    where: { id: { in: Array.from(new Set(rows.map((r) => r.sender_id))) } },
    select: { id: true, firstName: true, lastName: true, role: true },
  });
  const byId = new Map(senders.map((u) => [u.id, { firstName: u.firstName, lastName: u.lastName, role: String(u.role) }]));

  return rows.map((r) => {
    const sender = byId.get(r.sender_id);
    return {
      id: r.id.toString(),
      senderId: r.sender_id.toString(),
      senderName: displayName(sender),
      isInstructor: sender?.role === "ADMIN",
      text: r.message,
      createdAt: r.created_at ? r.created_at.toISOString() : null,
    };
  });
}

/** Messages de la classe. Sans ?after : les 50 derniers. Avec ?after=<id> : seulement les nouveaux. */
export async function GET(request: Request, { params }: Params) {
  const sessionId = await parseSessionId(params);
  if (sessionId === null) return NextResponse.json({ error: "Classe invalide." }, { status: 400 });

  try {
    const access = await authorizeClassroom(sessionId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

    const roomId = await getOrCreateRoom(sessionId, access.sessionTitle);
    const after = new URL(request.url).searchParams.get("after");

    let rows: ChatRow[];
    if (after && /^\d+$/.test(after)) {
      rows = await prisma.chat_messages.findMany({
        where: { room_id: roomId, id: { gt: BigInt(after) } },
        orderBy: { id: "asc" },
        take: 100,
        select: { id: true, sender_id: true, message: true, created_at: true },
      });
    } else {
      rows = (
        await prisma.chat_messages.findMany({
          where: { room_id: roomId },
          orderBy: { id: "desc" },
          take: 50,
          select: { id: true, sender_id: true, message: true, created_at: true },
        })
      ).reverse();
    }

    const call = await getActiveCall(roomId);

    return NextResponse.json(
      {
        messages: await toMessages(rows),
        call: { active: call !== null, startedAt: call ? call.startedAt.toISOString() : null },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Classroom messages GET error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  const sessionId = await parseSessionId(params);
  if (sessionId === null) return NextResponse.json({ error: "Classe invalide." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const text = typeof body.message === "string" ? body.message.trim() : "";
  if (!text) return NextResponse.json({ error: "Le message est vide." }, { status: 400 });
  if (text.length > MESSAGE_MAX_LENGTH) {
    return NextResponse.json({ error: `Message trop long (${MESSAGE_MAX_LENGTH} caractères maximum).` }, { status: 400 });
  }

  try {
    const access = await authorizeClassroom(sessionId);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status });

    const roomId = await getOrCreateRoom(sessionId, access.sessionTitle);

    // Anti-flood : 10 messages maximum toutes les 10 secondes par personne.
    const recent = await prisma.chat_messages.count({
      where: { room_id: roomId, sender_id: access.user.id, created_at: { gte: new Date(Date.now() - 10_000) } },
    });
    if (recent >= 10) {
      return NextResponse.json({ error: "Tu écris trop vite, patiente quelques secondes." }, { status: 429 });
    }

    const created = await prisma.chat_messages.create({
      data: { room_id: roomId, sender_id: access.user.id, message: text },
      select: { id: true, sender_id: true, message: true, created_at: true },
    });

    const [message] = await toMessages([created]);
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("Classroom messages POST error:", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }
}