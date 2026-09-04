import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Footer from "@/components/layout/Footer";
import ServicesOverview from "@/components/home/ServicesOverview";
import PacksPreview from "@/components/home/PacksPreview";
import ServicesGrid from "@/components/home/ServicesGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-nexora-bg text-white">
      <Navbar />
      <div className="pt-20">
        <Hero />
         <ServicesGrid />
        <ServicesOverview />
        <PacksPreview />
        <Footer />
       
      </div>
    </main>
  );
}