const services = [
  {
    title: "Développement Web & Mobile",
    description: "Création d'applications modernes, réactives et performantes sur-mesure (React, Next.js, Mobile).",
    icon: "💻",
  },
  {
    title: "Formation en Ligne",
    description: "Parcours de 3 mois axés sur la pratique pour maîtriser les technologies web actuelles.",
    icon: "🎓",
  },
  {
    title: "Solutions Web & Maintenance",
    description: "Audit, optimisation, sécurisation et gestion d'infrastructure web pour vos projets.",
    icon: "⚙️",
  },
  {
    title: "Community Management & Design",
    description: "Gestion de votre image de marque, réseaux sociaux et création de supports visuels d'impact.",
    icon: "🚀",
  },
];

export default function ServicesOverview() {
  return (
    <section id="services" className="py-24 bg-nexora-bg px-6 border-t border-nexora-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Nos Domaines d'Expertise</h2>
          <p className="text-gray-400">Des solutions numériques complètes pour propulser votre entreprise et former les talents de demain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-nexora-card border border-nexora-border hover:border-nexora-blue/50 transition duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition transform">{s.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}