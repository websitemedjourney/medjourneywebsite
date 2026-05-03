import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PackagesSection from "@/components/PackagesSection";
import ReviewsSection from "@/components/ReviewsSection";
import YoutubeSection from "@/components/YoutubeSection";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { applyTheme, DEFAULT_THEME } from "@/lib/theme";

const Index = () => {
  useEffect(() => {
    // Try to use first package theme as the landing default; fall back to DEFAULT_THEME
    let cancelled = false;
    fetch("/packages/index.json")
      .then(r => r.json())
      .then(async (idx) => {
        const first = idx?.packages?.[0];
        if (!first) return;
        const detail = await fetch(`/packages/${first.id}.json`).then(r => r.json()).catch(() => null);
        if (!cancelled && detail?.theme) applyTheme(detail.theme);
      })
      .catch(() => applyTheme(DEFAULT_THEME));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.title = "Med Journey — Hand-crafted journeys across India";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", "Curated India travel packages — Kashmir, Kerala, Rajasthan & more. Hand-crafted itineraries with real culture and unforgettable moments.");
  }, []);

  return (
    <div className="min-h-screen theme-bg">
      <Header />
      <main>
        <Hero />
        <PackagesSection />
        <ReviewsSection />
        <YoutubeSection />
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export default Index;
