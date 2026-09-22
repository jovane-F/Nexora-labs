"use client";

import { Suspense, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Space = "etudiant" | "client" | "admin";

const spaceLabels: Record<Space, string> = {
  etudiant: "Espace Étudiant",
  client: "Espace Client",
  admin: "Administration",
};

const redirectPaths: Record<Space, string> = {
  etudiant: "/dashboard/etudiant",
  client: "/dashboard/client",
  admin: "/dashboard/admin",
};

const signupBySpace: Record<Space, { label: string; href: string } | null> = {
  etudiant: { label: "Choisis un pack pour t'inscrire", href: "/formations" },
  client: { label: "Envoie ta demande de devis", href: "/devis" },
  admin: null,
};

function isSpace(value: string | null): value is Space {
  return value === "etudiant" || value === "client" || value === "admin";
}

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSpace = searchParams.get("espace");

  const [space, setSpace] = useState<Space>(isSpace(initialSpace) ? initialSpace : "etudiant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Merci de renseigner ton email et ton mot de passe.");
      return;
    }

    setLoading(true);

    // TODO: remplacer par un vrai appel d'authentification (API route / NextAuth / etc.)
    // qui vérifie les identifiants, le rôle associé au compte, et crée une session
    // avant de rediriger vers le bon espace.
    setTimeout(() => {
      setLoading(false);
      router.push(redirectPaths[space]);
    }, 600);
  }

  const signup = signupBySpace[space];

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white flex items-center justify-center px-4 sm:px-8 pt-28 pb-16 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00A3FF]/15 blur-[140px] rounded-full pointer-events-none" />

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
          <h1 className="text-3xl font-black tracking-tight">Connexion</h1>
          <p className="text-gray-400 text-sm mt-2">{spaceLabels[space]}</p>
        </div>

        {/* Sélecteur d'espace */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          {(Object.keys(spaceLabels) as Space[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpace(s)}
              className={`flex-1 text-xs font-semibold py-2 rounded-full transition-colors duration-300 ${
                space === s ? "bg-[#00A3FF] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {s === "etudiant" ? "Étudiant" : s === "client" ? "Client" : "Admin"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5"
        >
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
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300">
                Mot de passe
              </label>
              <Link href="/connexion/mot-de-passe-oublie" className="text-xs text-[#00A3FF] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF]/60 focus:ring-1 focus:ring-[#00A3FF]/60 transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full px-6 py-3.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] disabled:opacity-60 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,163,255,0.5)] transition duration-300"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </motion.button>
        </form>

        {signup && (
          <p className="text-center text-sm text-gray-400 mt-6">
            Pas encore de compte ?{" "}
            <Link href={signup.href} className="text-[#00A3FF] font-semibold hover:underline">
              {signup.label}
            </Link>
          </p>
        )}
      </motion.div>
    </main>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionForm />
    </Suspense>
  );
}