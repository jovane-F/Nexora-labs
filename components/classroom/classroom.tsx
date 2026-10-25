"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Msg = {
  id: string;
  senderId: string;
  senderName: string;
  isInstructor: boolean;
  text: string;
  createdAt: string | null;
};

type Props = {
  sessionId: number;
  title: string;
  me: { id: string };
  isAdmin: boolean;
  /** Quota de cours audio (administrateurs) : minutes déjà utilisées ce mois-ci et seuils. */
  initialUsageMinutes: number;
  limitMinutes: number;
  warningMinutes: number;
  backHref: string;
  backLabel: string;
};

const POLL_MS = 3000;

function formatMinutes(total: number): string {
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, "0")}`;
}

/** Fusionne sans doublon et garde l'ordre des identifiants. */
function merge(previous: Msg[], incoming: Msg[]): Msg[] {
  const known = new Set(previous.map((m) => m.id));
  const added = incoming.filter((m) => !known.has(m.id));
  if (added.length === 0) return previous;
  return [...previous, ...added].sort((a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id));
}

export default function ClassRoom({
  sessionId,
  title,
  me,
  isAdmin,
  initialUsageMinutes,
  limitMinutes,
  warningMinutes,
  backHref,
  backLabel,
}: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [fatal, setFatal] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [callBusy, setCallBusy] = useState(false);
  const [callError, setCallError] = useState("");
  const [usage, setUsage] = useState(initialUsageMinutes);

  const lastIdRef = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const poll = useCallback(async (): Promise<"ok" | "stop"> => {
    try {
      const query = lastIdRef.current ? `?after=${lastIdRef.current}` : "";
      const res = await fetch(`/api/classes/${sessionId}/messages${query}`, { cache: "no-store" });
      const data = await res.json();

      if (res.status === 401) {
        setFatal("Ta session a expiré. Reconnecte-toi pour continuer.");
        return "stop";
      }
      if (!res.ok) {
        setFatal(data.error ?? "Accès refusé.");
        return "stop";
      }

      const incoming: Msg[] = data.messages;
      if (incoming.length > 0) {
        lastIdRef.current = incoming[incoming.length - 1].id;
        setMessages((prev) => merge(prev, incoming));
      }
      setCallActive(Boolean(data.call?.active));
      setError("");
    } catch {
      setError("Connexion perdue, nouvelle tentative…");
    }
    return "ok";
  }, [sessionId]);

  // Actualisation régulière (tant que l'onglet est visible).
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loop = async () => {
      if (stopped) return;
      if (document.visibilityState === "visible") {
        if ((await poll()) === "stop") return;
      }
      timer = setTimeout(loop, POLL_MS);
    };
    loop();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [poll]);

  // Défilement vers le bas quand de nouveaux messages arrivent (si on n'est pas remonté dans l'historique).
  useEffect(() => {
    const box = listRef.current;
    if (box && stickToBottom.current) box.scrollTop = box.scrollHeight;
  }, [messages]);

  // Le cours est terminé : on referme la fenêtre d'appel.
  useEffect(() => {
    if (!callActive) setJoinUrl(null);
  }, [callActive]);

  async function submit() {
    const value = text.trim();
    if (!value || sending) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/classes/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Impossible d'envoyer le message.");
      } else {
        setText("");
        stickToBottom.current = true;
        setMessages((prev) => merge(prev, [data.message]));
      }
    } catch {
      setError("Impossible d'envoyer le message. Vérifie ta connexion.");
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  async function callAction(action: "start" | "end" | "join") {
    setCallBusy(true);
    setCallError("");
    try {
      const res = await fetch(`/api/classes/${sessionId}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCallError(data.error ?? "Une erreur est survenue.");
        return;
      }

      if (action === "join") {
        setJoinUrl(data.url);
      } else if (action === "start") {
        setCallActive(true);
        if (typeof data.usageMinutes === "number") setUsage(data.usageMinutes);
        await callAction("join");
      } else {
        setJoinUrl(null);
        setCallActive(false);
        if (typeof data.usageMinutes === "number") setUsage(data.usageMinutes);
      }
    } catch {
      setCallError("Impossible de contacter le serveur.");
    } finally {
      setCallBusy(false);
    }
  }

  const quotaReached = usage >= limitMinutes;
  const quotaWarning = usage >= warningMinutes;
  const quotaPercent = Math.min(100, Math.round((usage / limitMinutes) * 100));

  const primaryButton =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-xs shadow-[0_0_20px_rgba(0,163,255,0.4)] transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed";
  const secondaryButton =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-colors disabled:opacity-60";

  return (
    <div className="space-y-5">
      <div>
        <Link href={backHref} className="inline-flex text-sm text-gray-400 hover:text-[#00A3FF] transition-colors mb-3">
          ← {backLabel}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
        <p className="text-gray-400 text-sm mt-1">Salle de classe</p>
      </div>

      {fatal && (
        <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-sm text-red-300">
          {fatal}{" "}
          <Link href="/connexion" className="underline font-semibold">
            Se connecter
          </Link>
        </div>
      )}

      {/* ---------- Cours audio ---------- */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${callActive ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
            <p className="text-sm font-semibold text-white">{callActive ? "Cours audio en cours" : "Aucun cours audio en ce moment"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!callActive && isAdmin && (
              <button type="button" onClick={() => callAction("start")} disabled={callBusy || quotaReached} className={primaryButton}>
                {callBusy ? "Lancement..." : "Lancer le cours audio"}
              </button>
            )}
            {callActive && !joinUrl && (
              <button type="button" onClick={() => callAction("join")} disabled={callBusy} className={primaryButton}>
                {callBusy ? "Connexion..." : "Rejoindre le cours"}
              </button>
            )}
            {callActive && joinUrl && (
              <button type="button" onClick={() => setJoinUrl(null)} className={secondaryButton}>
                Quitter l'appel
              </button>
            )}
            {callActive && isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Terminer le cours pour toute la classe ?")) callAction("end");
                }}
                disabled={callBusy}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 text-red-300 font-semibold text-xs transition-colors disabled:opacity-60"
              >
                Terminer le cours
              </button>
            )}
          </div>
        </div>

        {callError && <p className="text-sm text-red-400">{callError}</p>}

        {isAdmin && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Heures de cours audio ce mois-ci</span>
              <span className={quotaReached ? "text-red-400" : quotaWarning ? "text-yellow-400" : ""}>
                {formatMinutes(usage)} / {formatMinutes(limitMinutes)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${quotaReached ? "bg-red-400" : quotaWarning ? "bg-yellow-400" : "bg-[#00A3FF]"}`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            {quotaReached && <p className="text-xs text-red-400 mt-2">Quota mensuel atteint : tu pourras relancer un cours le mois prochain.</p>}
            {!quotaReached && quotaWarning && <p className="text-xs text-yellow-400 mt-2">Tu approches de ta limite mensuelle de cours audio.</p>}
          </div>
        )}

        {joinUrl && (
          <iframe
            src={joinUrl}
            title="Cours audio"
            allow="microphone; camera; autoplay; display-capture; fullscreen"
            className="w-full h-[420px] rounded-xl border border-white/10 bg-black"
          />
        )}
      </div>

      {/* ---------- Discussion ---------- */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
        <div
          ref={listRef}
          onScroll={(e) => {
            const box = e.currentTarget;
            stickToBottom.current = box.scrollHeight - box.scrollTop - box.clientHeight < 120;
          }}
          className="h-[420px] overflow-y-auto p-5 space-y-3"
        >
          {messages.length === 0 && !fatal && (
            <p className="text-sm text-gray-500 text-center mt-16">Aucun message pour l'instant. Lance la discussion !</p>
          )}
          {messages.map((m) => {
            const mine = m.senderId === me.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    mine
                      ? "bg-[#00A3FF]/20 border border-[#00A3FF]/30 text-white"
                      : m.isInstructor
                        ? "bg-yellow-400/10 border border-yellow-400/20 text-gray-100"
                        : "bg-white/5 border border-white/10 text-gray-200"
                  }`}
                >
                  {!mine && <p className={`text-[11px] font-semibold mb-0.5 ${m.isInstructor ? "text-yellow-300" : "text-[#00A3FF]"}`}>{m.senderName}</p>}
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  {m.createdAt && (
                    <p className="text-[10px] text-gray-500 mt-1 text-right">
                      {new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-4">
          {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
          <div className="flex items-end gap-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              maxLength={2000}
              placeholder="Écris un message… (Entrée pour envoyer, Maj+Entrée pour un retour à la ligne)"
              disabled={Boolean(fatal)}
              className="flex-1 resize-none px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors disabled:opacity-50"
            />
            <button type="button" onClick={submit} disabled={sending || !text.trim() || Boolean(fatal)} className={primaryButton}>
              {sending ? "..." : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}