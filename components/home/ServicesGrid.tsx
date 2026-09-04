"use client";

import { motion } from "framer-motion";

const services = [
  { id: "01", title: "Design Web", desc: "Sites modernes, responsifs et performants", icon: "💻" },
  { id: "02", title: "SEO & Performance", desc: "Améliorez votre visibilité et vos conversions", icon: "📈" },
  { id: "03", title: "E-Commerce", desc: "Boutiques en ligne sécurisées & optimisées", icon: "🛒" },
  { id: "04", title: "Support 24/7", desc: "Assistance continue et réactive", icon: "🎧" },
];

export default function ServicesGrid() {
  return (
    <section className="py-20 px-6 bg-[#0B0E17] relative z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(0,163,255,0.6)",
              boxShadow: "0px 0px 25px rgba(0,163,255,0.2)" 
            }}
            className="p-6 rounded-2xl bg-[#121621] border border-white/5 transition-all duration-300 group cursor-pointer"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}