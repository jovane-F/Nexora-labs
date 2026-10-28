// Messages vocaux : constantes et fonctions pures (sans Prisma ni Node), utilisables côté serveur ET navigateur.
//
// Un message vocal est stocké dans chat_messages.message sous la forme :
//     __audio__|<type mime>|<durée en secondes>|<audio encodé en base64>
// Les messages texte ne peuvent jamais commencer par ce préfixe (refusé à l'envoi).

export const AUDIO_PREFIX = "__audio__|";
export const AUDIO_MAX_SECONDS = 120;
export const AUDIO_MAX_BYTES = 2 * 1024 * 1024; // 2 Mo

export const AUDIO_MIME_TYPES = ["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav"] as const;

/** « audio/webm;codecs=opus » → « audio/webm » si le format est autorisé, sinon null. */
export function baseMime(contentType: string | null | undefined): string | null {
  const base = (contentType ?? "").split(";")[0].trim().toLowerCase();
  return (AUDIO_MIME_TYPES as readonly string[]).includes(base) ? base : null;
}

export function clampSeconds(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(AUDIO_MAX_SECONDS, Math.max(0, Math.round(value)));
}

export function buildAudioMessage(mime: string, seconds: number, base64: string): string {
  return `${AUDIO_PREFIX}${mime}|${clampSeconds(seconds)}|${base64}`;
}

/** Lit seulement l'en-tête (type et durée) : suffit pour une ligne de liste tronquée. */
export function parseAudioPrefix(message: string): { mime: string; seconds: number } | null {
  const match = /^__audio__\|([a-z0-9.+/-]+)\|(\d{1,3})\|/.exec(message);
  return match ? { mime: match[1], seconds: Number(match[2]) } : null;
}

/** Lit le message complet, audio compris. */
export function parseAudioMessage(message: string): { mime: string; seconds: number; base64: string } | null {
  const head = parseAudioPrefix(message);
  if (!head) return null;
  const base64 = message.slice(AUDIO_PREFIX.length + head.mime.length + 1 + String(head.seconds).length + 1);
  return /^[A-Za-z0-9+/]*={0,2}$/.test(base64) && base64.length > 0 ? { ...head, base64 } : null;
}

/**
 * Lecture partielle (en-tête HTTP Range) : Safari et iPhone l'exigent pour jouer un fichier audio.
 * Renvoie null si pas de Range exploitable (on envoie alors tout le fichier), "invalid" si la plage est hors du fichier.
 */
export function parseRange(header: string | null, total: number): { start: number; end: number } | "invalid" | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (match[1] === "" && match[2] === "")) return null;

  if (match[1] === "") {
    const last = Number(match[2]); // « les N derniers octets »
    if (last === 0) return "invalid";
    return { start: Math.max(0, total - last), end: total - 1 };
  }

  const start = Number(match[1]);
  const end = match[2] === "" ? total - 1 : Math.min(Number(match[2]), total - 1);
  if (start >= total || start > end) return "invalid";
  return { start, end };
}