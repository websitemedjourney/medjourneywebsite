import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PackagesSection from "@/components/PackagesSection";
import ReviewsSection from "@/components/ReviewsSection";
import YoutubeSection from "@/components/YoutubeSection";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { ThemeFromFirstPackage } from "@/components/theme-from-first-package";

export const metadata: Metadata = {
  title: "Med Journey — Hand-crafted journeys across India",
  description:
    "Curated India travel packages — Kashmir, Kerala, Rajasthan & more. Hand-crafted itineraries with real culture and unforgettable moments.",
};

export default function HomePage() {
  return (
    <>
      <ThemeFromFirstPackage />
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
    </>
  );
}
