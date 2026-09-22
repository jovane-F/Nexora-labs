"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const spaces = [
  { label: "Espace Étudiant", desc: "Cours, devoirs & planning", href: "/connexion?espace=etudiant" },
  { label: "Espace Client", desc: "Projets, devis & support", href: "/connexion?espace=client" },
  { label: "Administration", desc: "Réservé à l'équipe Nexora", href: "/connexion?espace=admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-[#0B0E17]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo + Texte */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative w-10 h-10 flex items-center justify-center shrink-0"
          >
             <Image
              src="/log.png" // Placez votre fichier image dans le dossier public/ (ex: public/logo.png)
              alt="Nexora Labs Logo"
              width={40}
              height={40}
              className="object-contain drop-shadow-[0_0_12px_rgba(0,163,255,0.8)]"
              priority
            />
          </motion.div>

          <motion.span 
            whileHover={{ scale: 1.02 }}
            className="text-2xl font-black tracking-wider text-white"
          >
            NEXORA <span className="text-[#00A3FF] drop-shadow-[0_0_12px_rgba(0,163,255,0.8)]">LABS</span>
          </motion.span>
        </Link>

        {/* Liens de navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          {["Accueil", "Services", "À Propos", "Projets", "Blog", "Contact"].map((item) => (
            <motion.div key={item} whileHover={{ y: -2, color: "#00A3FF" }}>
              <Link href={`#${item.toLowerCase()}`} className="transition">
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Connexion + CTA */}
        <div className="flex items-center gap-3">
          {/* Dropdown Connexion / Espaces */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold backdrop-blur-md transition duration-300"
            >
              <UserIcon />
              <span className="hidden sm:inline">Se connecter</span>
              <ChevronIcon open={open} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#121621] border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Accéder à mon espace
                  </div>
                  <div className="px-2 pb-2">
                    {spaces.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        onClick={() => setOpen(false)}
                        className="block px-3.5 py-2.5 rounded-xl hover:bg-[#00A3FF]/10 transition-colors group"
                      >
                        <p className="text-sm font-semibold text-white group-hover:text-[#00A3FF] transition-colors">
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-500">{s.desc}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/10 px-4 py-3">
                    <p className="text-xs text-gray-400">
                      Pas encore de compte ?{" "}
                      <Link
                        href="/formations"
                        onClick={() => setOpen(false)}
                        className="text-[#00A3FF] font-semibold hover:underline"
                      >
                        S'inscrire
                      </Link>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
            <Link
              href="/devis"
              className="px-6 py-2.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,163,255,0.4)] transition flex items-center gap-2"
            >
              Démarrer →
            </Link>
          </motion.div>
        </div>

      </div>
    </motion.nav>
  );
}