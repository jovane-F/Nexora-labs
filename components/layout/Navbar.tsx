"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-[#0B0E17]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-black tracking-wider text-white"
          >
            NEXORA <span className="text-[#00A3FF] drop-shadow-[0_0_12px_rgba(0,163,255,0.8)]">LABS</span>
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          {["Accueil", "Services", "À Propos", "Projets", "Blog", "Contact"].map((item, index) => (
            <motion.div key={item} whileHover={{ y: -2, color: "#00A3FF" }}>
              <Link href={`#${item.toLowerCase()}`} className="transition">
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/devis"
            className="px-6 py-2.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,163,255,0.4)] transition flex items-center gap-2"
          >
            Démarrer →
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}