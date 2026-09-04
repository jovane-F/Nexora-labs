import type { Metadata } from "next";
import "./globals.css";

// Remplacez cette URL par l'adresse exacte de votre site sur Vercel
const siteUrl = "https://nexora-labs-six.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexora Labs | Agence Web & Solutions Digitales",
    template: "%s | Nexora Labs",
  },
  description:
    "Conception de sites web modernes, applications sur-mesure, design UI/UX et formations tech. Propulsez votre entreprise avec Nexora Labs.",
  keywords: ["Nexora Labs", "Agence Web", "Cameroun", "Création site web", "Next.js", "Design UI/UX"],
  
  // ConfiguratiOn pour WhatsApp, Facebook, LinkedIn (Open Graph)
  openGraph: {
    title: "Nexora Labs | Agence Web & Solutions Digitales",
    description:
      "Conception de sites web modernes, applications sur-mesure, design UI/UX et formations tech.",
    url: siteUrl,
    siteName: "Nexora Labs",
    images: [
      {
        url: "/og-image.png", // Lien vers l'image dans public/
        width: 1200,
        height: 630,
        alt: "Nexora Labs Preview",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  // Configuration pour X / Twitter
  twitter: {
    card: "summary_large_image",
    title: "Nexora Labs | Agence Web & Solutions Digitales",
    description:
      "Conception de sites web modernes, applications sur-mesure, design UI/UX et formations tech.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-[#0B0E17] text-white antialiased">
        {children}
      </body>
    </html>
  );
}