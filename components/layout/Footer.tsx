"use client";

import { motion } from "framer-motion";

// === ICÔNES SVG VECTORIELLES POUR RÉSEAUX SOCIAUX ===
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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080B12] text-gray-400 pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-[#00A3FF]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Banner Newsletter / CTA rapide */}
        <div className="mb-16 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-[#121621] via-[#161C2E] to-[#121621] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Prêt à propulser vos projets web ?
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Rejoignez nos prochaines sessions de formation ou confiez-nous la conception de vos applications.
            </p>
          </div>
          
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="w-full sm:w-auto flex flex-col sm:flex-row gap-3"
          >
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00A3FF] transition-colors min-w-[260px]"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 rounded-xl bg-[#00A3FF] text-black font-bold text-sm hover:bg-[#00A3FF]/90 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-[#00A3FF]/20"
            >
              <span>S'abonner</span>
              <SendIcon />
            </button>
          </form>
        </div>

        {/* Grille Principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/5">
          
          {/* Colonne 1 : Branding */}
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
              Laboratoire d'innovation digitale & centre de formation tech. Nous concevons des logiciels modernes et formons la prochaine génération de développeurs.
            </p>

            {/* Réseaux Sociaux : TikTok, LinkedIn, Facebook, Instagram */}
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

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Plateforme
            </h4>
            <ul className="space-y-3 text-sm">
              {["Accueil", "Expertises", "Formations", "Mentors", "À propos"].map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-[#00A3FF] transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Packs Formations */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Packs 3 Mois
            </h4>
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

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPinIcon />
                <span>Douala, Cameroun & En Ligne</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon />
                <a href="mailto:nexoralabs26jhn@gmail.com" className="hover:text-[#00A3FF] transition-colors">
                  nexoralabs26jhn@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bas de page : Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} Nexora Labs. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Mentions légales</a>
          </div>
        </div>

      </div>
    </footer>
  );
}