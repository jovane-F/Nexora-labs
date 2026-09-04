"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function DevisPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#0B0E17] text-white pt-32 pb-20 px-4 sm:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Halo lumineux */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00A3FF]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-3xl w-full z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00A3FF] text-xs font-semibold mb-4">
            Demande de Devis Gratuit
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Concevons votre projet <br />
            <span className="text-[#00A3FF]">sur-mesure</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Remplissez ce formulaire et recevez une estimation détaillée sous 24h.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-white/5 border border-[#00A3FF]/30 text-center backdrop-blur-md"
          >
            <div className="w-16 h-16 bg-[#00A3FF]/20 text-[#00A3FF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-bold mb-2">Demande envoyée !</h2>
            <p className="text-gray-300 text-sm">
              Merci ! Notre équipe étudie votre besoin et vous recontactera très rapidement.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Nom Complet</label>
                <input
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Adresse Email</label>
                <input
                  type="email"
                  required
                  placeholder="contact@exemple.cm"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Téléphone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+237 6xx xx xx xx"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Type de Service</label>
                <select className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#00A3FF] transition">
                  <option value="vitrine">Site Vitrine / Pro</option>
                  <option value="ecommerce">Site E-commerce</option>
                  <option value="webapp">Application Web / SaaS</option>
                  <option value="redesign">Refonte / Design UI/UX</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Détails du projet</label>
              <textarea
                rows={4}
                required
                placeholder="Décrivez brièvement vos objectifs, fonctionnalités souhaitées..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF] transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#00A3FF] hover:bg-[#0076F5] text-white font-bold transition shadow-[0_0_20px_rgba(0,163,255,0.4)]"
            >
              Envoyer ma demande de devis
            </button>
          </motion.form>
        )}
      </div>
    </main>
  );
}