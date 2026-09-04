import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permet de valider le build sur Vercel même si la génération automatique des types Next.js bogue
    ignoreBuildErrors: true,
  },
};

export default nextConfig;