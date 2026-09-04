import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import PacksPreview from "@/components/home/PacksPreview";

export default function Home() {
  return (
    <main className="min-h-screen bg-nexora-bg text-white">
      <Navbar />
      <div className="pt-20">
        <Hero />
        <ServicesOverview />
        <PacksPreview />
      </div>
    </main>
  );
}