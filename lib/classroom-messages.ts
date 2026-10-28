import { prisma } from "@/lib/prisma";
import { displayName } from "@/lib/classroom";
import { parseAudioPrefix } from "@/lib/chat-audio";

export type ChatRow = { id: bigint; sender_id: bigint; message: string; created_at: Date | null };

/** Transforme des lignes de chat_messages en messages prêts pour le navigateur (jamais l'audio lui-même). */
export async function toMessages(rows: ChatRow[]) {
  const senders = await prisma.user.findMany({
    where: { id: { in: Array.from(new Set(rows.map((r) => r.sender_id))) } },
    select: { id: true, firstName: true, lastName: true, role: true },
  });
  const byId = new Map(senders.map((u) => [u.id, { firstName: u.firstName, lastName: u.lastName, role: String(u.role) }]));

  return rows.map((r) => {
    const sender = byId.get(r.sender_id);
    const audio = parseAudioPrefix(r.message);
    return {
      id: r.id.toString(),
      senderId: r.sender_id.toString(),
      senderName: displayName(sender),
      isInstructor: sender?.role === "ADMIN",
      kind: audio ? ("audio" as const) : ("text" as const),
      audioSeconds: audio ? audio.seconds : null,
      text: audio ? "" : r.message,
      createdAt: r.created_at ? r.created_at.toISOString() : null,
    };
  });
}