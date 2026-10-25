"use client";

import { useState } from "react";

function TiktokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#00A3FF]">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#00A3FF]">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-green-400">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Inscription Formation",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "Inscription Formation", message: "" });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setErrorMessage("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#080B12] text-gray-400 pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#00A3FF]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION FORMULAIRE DE CONTACT */}
        <section id="contact" className="mb-20 p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#121621] to-[#0D101A] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Colonne Gauche */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-xs font-semibold uppercase tracking-wider">
                Contactez-nous
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Une question ? Un projet en tête ?
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Envoyez-nous un message pour vous inscrire à une session ou pour demander un devis sur mesure.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Adresse</p>
                    <p className="font-semibold text-white">Douala, Cameroun & En Ligne</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MailIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email direct</p>
                    <a href="mailto:nexoralabsjhn1@gmail.com" className="font-semibold text-white hover:text-[#00A3FF] transition-colors">
                      nexoralabsjhn1@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                    <CheckIcon />
                  </div>
                  <h4 className="text-xl font-bold text-white">Message envoyé avec succès !</h4>
                  <p className="text-sm text-gray-400">Nous avons bien reçu votre demande et reviendrons vers vous sous peu.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs text-[#00A3FF] underline cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jovane Fils"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A3FF] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                        Adresse Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="exemple@domaine.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A3FF] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Sujet / Intérêt
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#121621] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00A3FF] transition-colors"
                    >
                      <option value="Inscription Formation">Inscription à une formation</option>
                      <option value="Demande de Devis Web">Demande de devis / Projet Web</option>
                      <option value="Mentorat / Coaching">Mentorat & Coaching</option>
                      <option value="Autre Demande">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Votre Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Décrivez votre projet ou vos questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A3FF] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#00A3FF] text-black font-bold text-sm hover:bg-[#00A3FF]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#00A3FF]/20"
                  >
                    <span>{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}</span>
                    <SendIcon />
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00A3FF] flex items-center justify-center font-black text-black text-lg shadow-lg shadow-[#00A3FF]/30">
                N
              </div>
              <span className="text-xl font-bold text-white tracking-wider">
                NEXORA<span className="text-[#00A3FF]">.LABS</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              Laboratoire d'innovation digitale & centre de formation tech.
            </p>

            <div className="flex items-center gap-3">
              {[
                { icon: TiktokIcon, href: "#", label: "TikTok" },
                { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
                { icon: FacebookIcon, href: "#", label: "Facebook" },
                { icon: InstagramIcon, href: "#", label: "Instagram" },
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00A3FF] hover:border-[#00A3FF]/40 hover:bg-[#00A3FF]/10 transition-all duration-300"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Plateforme</h4>
            <ul className="space-y-3 text-sm">
              {["Accueil", "Expertises", "Formations", "Mentors", "Contact"].map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-[#00A3FF] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Packs 3 Mois</h4>
            <ul className="space-y-3 text-sm">
              {["Next.js Pro", "Web Starter", "PHP Web", "Spring Boot", "Conception Projets"].map((pack, idx) => (
                <li key={idx}>
                  <a href="#formations" className="hover:text-[#00A3FF] transition-colors duration-200">
                    {pack}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Assistance</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Lun - Ven : 08h00 - 18h00</li>
              <li>Samedi : 09h00 - 14h00</li>
              <li className="pt-2">
                <a href="mailto:nexoralabs26jhn@gmail.com" className="text-[#00A3FF] hover:underline">
                  Support en ligne 24/7
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} Nexora Labs. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</a>
          </div>
        </div>

      </div>
    </footer>
  );
}