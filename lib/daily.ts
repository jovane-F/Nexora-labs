// Client minimal de l'API REST de Daily (https://docs.daily.co/reference/rest-api). Serveur uniquement :
// la clé DAILY_API_KEY ne doit jamais être envoyée au navigateur.

const BASE_URL = "https://api.daily.co/v1";

function apiKey(): string {
  const key = process.env.DAILY_API_KEY;
  if (!key) throw new Error("DAILY_API_KEY est absent du fichier .env");
  return key;
}

async function daily<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Daily ${method} ${path} a répondu ${res.status} ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

/** Crée une salle privée (accessible seulement avec un jeton), audio par défaut, qui expire d'elle-même. */
export function createRoom(name: string, expiresAtUnix: number) {
  return daily<{ name: string; url: string }>("/rooms", "POST", {
    name,
    privacy: "private",
    properties: { exp: expiresAtUnix, eject_at_room_exp: true, start_video_off: true },
  });
}

/** Jeton personnel pour entrer dans une salle privée ; is_owner donne les droits d'animateur. */
export async function createMeetingToken(params: {
  roomName: string;
  userName: string;
  isOwner: boolean;
  expiresAtUnix: number;
}): Promise<string> {
  const result = await daily<{ token: string }>("/meeting-tokens", "POST", {
    properties: {
      room_name: params.roomName,
      user_name: params.userName,
      is_owner: params.isOwner,
      exp: params.expiresAtUnix,
      eject_at_token_exp: true,
      start_video_off: true,
    },
  });
  return result.token;
}

export async function getRoomUrl(name: string): Promise<string> {
  const room = await daily<{ url: string }>(`/rooms/${encodeURIComponent(name)}`, "GET");
  return room.url;
}

export async function deleteRoom(name: string): Promise<void> {
  await daily<unknown>(`/rooms/${encodeURIComponent(name)}`, "DELETE");
}