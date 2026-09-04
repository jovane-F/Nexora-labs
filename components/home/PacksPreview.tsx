const packs = [
  { id: "01", name: "Web Starter", stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS"], lead: "Hadja" },
  { id: "02", name: "PHP Web", stack: ["HTML", "CSS", "JavaScript", "PHP"], lead: "Hadja" },
  { id: "03", name: "Spring Boot", stack: ["Spring Boot", "Angular"], lead: "Boris" },
  { id: "04", name: "Next.js Pro", stack: ["Next.js", "React", "Tailwind CSS"], lead: "Jo'ovy" },
  { id: "05", name: "Conception de Projets", stack: ["Cahier de charge", "Merise/UML", "Figma"], lead: "Équipe" },
];

export default function PacksPreview() {
  return (
    <section id="formations" className="py-24 bg-nexora-card/50 px-6 border-t border-nexora-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-nexora-blue text-sm font-semibold tracking-wide uppercase">Parcours de Formation</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">3 Mois — 3 fois / Semaine</h2>
          <p className="text-gray-400">Apprenez, créez et innovez à travers nos packs pratiques encadrés par des experts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-nexora-card border border-nexora-border hover:border-nexora-accent/50 transition"
            >
              <div>
                <span className="text-xs font-bold text-nexora-blue uppercase tracking-wider">Pack {pack.id}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-4">{pack.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {pack.stack.map((tech, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-nexora-bg border border-nexora-border text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-nexora-border/60 flex items-center justify-between text-xs text-gray-400">
                <span>Format : {pack.lead}</span>
                <span className="text-nexora-accent font-semibold">Souscrire →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}