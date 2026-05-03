import heroImage from "@/assets/hero-travel.jpg";
import { ArrowRight, Compass } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Sunset over Dal Lake with shikaras"
        width={1920}
        height={1088}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/30" />
      <div
        className="absolute inset-0 mix-blend-multiply opacity-40"
        style={{ background: "linear-gradient(135deg, rgb(var(--primary-color)) 0%, transparent 60%)" }}
      />

      <div className="container-px relative z-10 text-white py-28">
        <div className="max-w-3xl fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase backdrop-blur-md bg-white/10 border border-white/20 mb-6">
            <Compass className="w-3.5 h-3.5" /> Med Journey
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-6">
            Where the road
            <br />
            <span style={{ color: "rgb(var(--accent-color))" }}>becomes a story.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mb-10 leading-relaxed">
            Hand-crafted journeys through India's most cinematic landscapes —
            from Himalayan valleys to backwater villages and desert palaces.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#packages" className="btn-accent text-base">
              Explore Packages <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#video" className="btn-outline-accent text-base !text-white !border-white/70 hover:!bg-white/10">
              Watch our story
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 max-w-md gap-6 border-t border-white/20 pt-6">
            {[
              ["12k+", "Happy travellers"],
              ["48", "Destinations"],
              ["4.9★", "Avg rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "rgb(var(--accent-color))" }}>{n}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a href="#packages" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs animate-float" aria-label="Scroll">
        Scroll to explore ↓
      </a>
    </section>
  );
};

export default Hero;
