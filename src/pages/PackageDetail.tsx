import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import ReviewsSection from "@/components/ReviewsSection";
import IncludedSection from "@/components/IncludedSection";
import ExcludedSection from "@/components/ExcludedSection";
import TermsSection from "@/components/TermsSection";
import { applyTheme, DEFAULT_THEME } from "@/lib/theme";
import type { PackageDetail } from "@/types";
import { ArrowLeft, Calendar, MapPin, Check, Utensils, Phone, MessageCircle, ChevronRight, Sparkles } from "lucide-react";

const PackageDetailPage = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!packageId) return;
    setError(false);
    fetch(`/packages/${packageId}.json`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: PackageDetail) => {
        setPkg(data);
        applyTheme(data.theme);
        document.title = `${data.title} — Med Journey`;
      })
      .catch(() => setError(true));

    return () => {
      // restore default theme when leaving
      applyTheme(DEFAULT_THEME);
    };
  }, [packageId]);

  if (error) {
    return (
      <div className="min-h-screen theme-bg grid place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl font-bold theme-text-primary mb-4">Package not found</h1>
          <Link to="/" className="btn-accent">Back to home</Link>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen theme-bg">
        <Header />
        <div className="pt-24 container-px space-y-4">
          <div className="h-[60vh] rounded-3xl bg-muted animate-pulse" />
          <div className="h-8 w-1/2 rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi Med Journey, I'd like to know more about "${pkg.title}" (${pkg.duration}, ${pkg.price}).`
  )}`;

  return (
    <div className="min-h-screen theme-bg theme-text">
      <Header />

      {/* Banner */}
      <section className="relative min-h-[80svh] flex items-end overflow-hidden">
        <img
          src={pkg.coverImage}
          alt={pkg.title}
          width={1280}
          height={832}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 theme-gradient opacity-80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="container-px relative z-10 text-white pb-16 pt-28">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-white/80 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/#packages" className="hover:text-white">Packages</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{pkg.title}</span>
          </nav>

          <div className="flex items-center gap-2 text-sm font-medium text-white/90 mb-4 fade-in">
            <MapPin className="w-4 h-4" />
            {pkg.destination.join(" • ")}
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold max-w-4xl leading-[1.05] mb-6 fade-in">
            {pkg.title}
          </h1>
          <div className="flex flex-wrap gap-3 fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-sm font-medium border border-white/20">
              <Calendar className="w-4 h-4" /> {pkg.duration}
            </span>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              style={{ backgroundColor: "rgb(var(--accent-color))", color: "#fff" }}
            >
              From {pkg.price}
            </span>
          </div>
        </div>
      </section>

      {/* Overview & Highlights */}
      <section className="section-pad">
        <div className="container-px grid lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ background: "rgb(var(--accent-color) / 0.12)", color: "rgb(var(--accent-color))" }}>
              Overview
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold theme-text-primary mb-5">
              About this journey
            </h2>
            <p className="text-base sm:text-lg leading-relaxed opacity-80">{pkg.overview}</p>
          </div>
          <aside className="rounded-3xl p-7 theme-gradient text-white shadow-xl h-fit sticky top-24">
            <Sparkles className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-display text-2xl font-bold mb-4">Trip Highlights</h3>
            <ul className="space-y-3">
              {pkg.highlights.map(h => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-white/95">
                  <span className="mt-1 grid place-items-center w-5 h-5 rounded-full bg-white/20 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <a href="#book" className="mt-6 btn-accent w-full !bg-white !text-[rgb(var(--primary-color))]" style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,.3)" }}>
              Book this trip
            </a>
          </aside>
        </div>
      </section>

      {/* Itinerary */}
      <section className="section-pad" style={{ background: "rgb(var(--accent-color) / 0.05)" }}>
        <div className="container-px">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ background: "rgb(var(--accent-color) / 0.15)", color: "rgb(var(--accent-color))" }}>
              Day by Day
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary">Itinerary</h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ background: "rgb(var(--accent-color) / 0.3)" }} />
            <div className="space-y-8">
              {pkg.itinerary.map((d, i) => {
                const isEvenDay = (i + 1) % 2 === 0;

                return (
                  <div key={d.day} className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full grid place-items-center font-display font-bold text-white shadow-lg z-10"
                      style={{ background: "rgb(var(--accent-color))" }}>
                      {d.day}
                    </div>

                    {/* Content Side */}
                    <div className={`flex-1 sm:w-1/2 ml-20 sm:ml-0 sm:px-8 ${isEvenDay ? "sm:order-2" : "sm:order-1"}`}>
                      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md">
                        <div className="text-xs font-semibold tracking-widest uppercase mb-2"
                          style={{ color: "rgb(var(--accent-color))" }}>
                          Day {d.day}
                        </div>
                        <h3 className="font-display text-xl font-bold theme-text-primary mb-2">{d.title}</h3>
                        
                        {d.image && (
                          <img 
                            src={d.image} 
                            alt={d.title} 
                            loading="lazy" 
                            className="w-full h-auto object-cover rounded-xl shadow-sm mb-4 sm:hidden" 
                          />
                        )}
                        
                        <p className="text-sm opacity-75 mb-3 leading-relaxed">{d.description}</p>
                        
                        {d.meals && (
                          <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                            <Utensils className="w-3 h-3" /> {d.meals}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image / Spacer Side */}
                    <div className={`hidden sm:block sm:w-1/2 sm:px-8 ${isEvenDay ? "sm:order-1" : "sm:order-2"}`}>
                      {d.image && (
                        <img 
                          src={d.image} 
                          alt={d.title} 
                          loading="lazy" 
                          className="w-full h-auto object-cover rounded-xl shadow-sm" 
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Inclusions / Exclusions — split brochure layout */}
      <IncludedSection items={pkg.inclusions} />
      <ExcludedSection items={pkg.exclusions} />

      {/* Terms & Conditions */}
      <TermsSection terms={pkg.termsAndConditions} note={pkg.termsNote} />

      {/* Gallery */}
      <section className="section-pad" style={{ background: "rgb(var(--primary-color) / 0.04)" }}>
        <div className="container-px">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ background: "rgb(var(--accent-color) / 0.15)", color: "rgb(var(--accent-color))" }}>
              Gallery
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary">Through the lens</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {pkg.gallery.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl group ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
              >
                <img src={src} alt={`${pkg.title} ${i+1}`} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="section-pad">
        <div className="container-px">
          <div className="rounded-3xl theme-gradient text-white p-10 sm:p-14 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              background: "radial-gradient(circle at 20% 30%, rgb(var(--accent-color)) 0%, transparent 50%)"
            }} />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Ready to pack your bags?</h2>
              <p className="text-white/85 max-w-xl mx-auto mb-8">
                Speak with a travel curator. We'll tailor dates, hotels, and add-ons to make this trip yours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+919876543210" className="btn-accent text-base">
                  <Phone className="w-5 h-5" /> Book Now
                </a>
                <a href={whatsappLink} target="_blank" rel="noreferrer"
                  className="btn-outline-accent text-base !text-white !border-white hover:!bg-white hover:!text-[rgb(var(--primary-color))]">
                  <MessageCircle className="w-5 h-5" /> WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold theme-text-primary hover:opacity-70">
              <ArrowLeft className="w-4 h-4" /> Back to all packages
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export default PackageDetailPage;
