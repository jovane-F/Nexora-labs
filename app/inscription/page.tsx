"use client";

import { Suspense, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { packs } from "@/lib/formations-data";

type Role = "etudiant" | "client";

const roleLabels: Record<Role, string> = {
  etudiant: "Étudiant",
  client: "Client",
};

const roleApiValue: Record<Role, "STUDENT" | "CLIENT"> = {
  etudiant: "STUDENT",
  client: "CLIENT",
};

function isRole(value: string | null): value is Role {
  return value === "etudiant" || value === "client";
}

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");
  const validSlugs = packs.map((p) => p.slug);
  const initialPacks = searchParams.getAll("pack").filter((s) => validSlugs.includes(s));

  const [role, setRole] = useState<Role>(isRole(initialRole) ? initialRole : "etudiant");
  const [selectedPacks, setSelectedPacks] = useState<string[]>(initialPacks);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function togglePack(slug: string) {
    setSelectedPacks((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (role === "etudiant" && selectedPacks.length === 0) {
      setError("Choisis au moins un pack pour t'inscrire.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          role: roleApiValue[role],
          packSlugs: role === "etudiant" ? selectedPacks : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue. Réessaie plus tard.");
        setLoading(false);
        return;
      }

      const enrolledCount = Array.isArray(data.enrolled) ? data.enrolled.length : 0;
      const unavailableCount = Array.isArray(data.unavailable) ? data.unavailable.length : 0;
      const params = new URLSearchParams({ espace: role, inscrit: "1" });
      if (enrolledCount > 0) params.set("packs", String(enrolledCount));
      if (unavailableCount > 0) params.set("nonDispo", String(unavailableCount));
      router.push(`/connexion?${params.toString()}`);
    } catch {
      setError("Impossible de contacter le serveur. Réessaie plus tard.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white flex items-center justify-center px-4 sm:px-8 pt-28 pb-16 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#00A3FF]/15 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider mb-4">
            Nexora Labs
          </span>
          <h1 className="text-3xl font-black tracking-tight">Créer un compte</h1>
          <p className="text-gray-400 text-sm mt-2">
            {role === "etudiant"
              ? "Rejoins Nexora Academy et accède à ton espace de formation."
              : "Crée ton compte client pour suivre tes projets avec Nexora Labs."}
          </p>
        </div>

        {/* Sélecteur de rôle */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          {(Object.keys(roleLabels) as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 text-xs font-semibold py-2 rounded-full transition-colors duration-300 ${
                role === r ? "bg-[#00A3FF] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5"
        >
          {role === "etudiant" && (
            <div>
              <p className="block text-xs font-semibold text-gray-300 mb-2">
                Packs de formation <span className="text-gray-500 font-normal">(un ou plusieurs)</span>
              </p>
              <div className="space-y-2">
                {packs.map((p) => {
                  const selected = selectedPacks.includes(p.slug);
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => togglePack(p.slug)}
                      className={`w-full flex items-center justify-between gap-3 text-left px-4 py-3 rounded-xl border transition-colors duration-300 ${
                        selected
                          ? "bg-[#00A3FF]/10 border-[#00A3FF]/60"
                          : "bg-white/5 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {p.name}
                          {p.popular && (
                            <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-black bg-[#00A3FF] px-1.5 py-0.5 rounded-full align-middle">
                              Populaire
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {p.duration} • {p.level}
                        </p>
                      </div>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          selected ? "bg-[#00A3FF] border-[#00A3FF]" : "border-white/20"
                        }`}
                      >
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold text-gray-300 mb-2">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Awa"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold text-gray-300 mb-2">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ndiaye"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-gray-300 mb-2">
              Téléphone <span className="text-gray-500 font-normal">(facultatif)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+237 6XX XX XX XX"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères min."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-300 mb-2">
                Confirmation
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full px-6 py-3.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] disabled:opacity-60 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,163,255,0.5)] transition duration-300"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Déjà un compte ?{" "}
          <Link href={`/connexion?espace=${role}`} className="text-[#00A3FF] font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <InscriptionForm />
    </Suspense>
  );
}