"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-28 sm:pt-36 pb-16 px-4 sm:px-8 bg-[#0B0E17] overflow-x-clip flex items-center justify-center">
      {/* Halo lumineux d'arrière-plan */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2] 
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[600px] lg:w-[900px] h-[280px] sm:h-[600px] lg:h-[900px] bg-[#00A3FF]/20 blur-[100px] sm:blur-[160px] rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center z-10 relative">
        
        {/* COLONNE GAUCHE : Textes & Boutons */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 }
            }
          }}
          className="lg:col-span-5 flex flex-col items-start space-y-5 text-left"
        >
          {/* Badge Néon */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_15px_rgba(0,163,255,0.2)]"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#00A3FF] animate-pulse" />
            Solutions Digitales sur-mesure
          </motion.div>

          {/* Grand Titre */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08]"
          >
            Sites Web <br />
            <span className="text-[#00A3FF] drop-shadow-[0_0_25px_rgba(0,163,255,0.7)]">
              Professionnels
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed"
          >
            Design moderne pour startups et entreprises. Développez votre présence digitale avec des performances d'exception et une expérience utilisateur inégalée.
          </motion.p>

          {/* Boutons d'action */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/devis"
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(0,163,255,0.5)] transition duration-300 w-full"
              >
                Obtenir un devis gratuit
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/services"
                className="flex items-center justify-center px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition duration-300 w-full"
              >
                Nos Services
              </Link>
            </motion.div>
          </motion.div>

          {/* Statistiques */}
          <motion.div 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="pt-5 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/10 w-full"
          >
            <div>
              <span className="block text-lg sm:text-2xl font-bold text-white">50+</span>
              <span className="text-[11px] sm:text-xs text-gray-400">Projets réalisés</span>
            </div>
            <div>
              <span className="block text-lg sm:text-2xl font-bold text-white">98%</span>
              <span className="text-[11px] sm:text-xs text-gray-400">Clients satisfaits</span>
            </div>
            <div>
              <span className="block text-lg sm:text-2xl font-bold text-white">24/7</span>
              <span className="text-[11px] sm:text-xs text-gray-400">Support dédié</span>
            </div>
          </motion.div>
        </motion.div>

        {/* COLONNE DROITE : Visuel Grand Format Sans Décalage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-7 relative flex justify-center items-center w-full lg:translate-x-4"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-full max-w-[650px] lg:max-w-none flex items-center justify-center p-2 sm:p-6"
          >
            {/* 1. Contour Néon Bleu Flou */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00A3FF] to-[#0076F5] rounded-3xl blur-xl sm:blur-2xl opacity-40 pointer-events-none" />

            {/* 2. Cadre Sombre Incliné */}
            <div className="absolute inset-1 sm:inset-0 bg-gradient-to-tr from-black to-zinc-900 border-r-4 sm:border-r-8 border-[#00A3FF] transform -rotate-2 sm:-rotate-3 rounded-2xl sm:rounded-3xl shadow-2xl opacity-90 pointer-events-none" />

            {/* 3. Cercle en Pointillés Rotatif */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="hidden sm:block absolute w-[88%] h-[88%] border-4 border-dashed border-[#00A3FF]/30 rounded-full pointer-events-none"
            />

            {/* 4. Image Principale GRAND FORMAT */}
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 bg-[#121621] shadow-2xl z-10">
              <Image
                src="/nexora.jpeg"
                alt="Nexora Labs Interface"
                width={1200}
                height={800}
                className="w-full h-auto object-cover transform hover:scale-105 transition duration-700 ease-out"
                priority
              />

              {/* Gradient de finition */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17]/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
          
        </motion.div>

      </div>
    </section>
  );
}
