"use client";

import { Fragment } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import ReviewsSection from "@/components/ReviewsSection";
import WriteReviewSection from "@/components/WriteReviewSection";
import IncludedSection from "@/components/IncludedSection";
import ExcludedSection from "@/components/ExcludedSection";
import TermsSection from "@/components/TermsSection";
import type { PackageDetail } from "@/app/types";
import { formatDuration, formatPrice } from "@/lib/format";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Check,
  Utensils,
  Phone,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Download,
} from "lucide-react";

const BRUSH_MASK = `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='4' result='noise' /%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='35' xChannelSelector='R' yChannelSelector='G' /%3E%3C/filter%3E%3Cg filter='url(%23b)' fill='black'%3E%3Crect width='82%25' height='82%25' x='9%25' y='9%25' rx='12' /%3E%3Crect width='70%25' height='6%25' x='15%25' y='4%25' rx='4' /%3E%3Crect width='70%25' height='6%25' x='15%25' y='90%25' rx='4' /%3E%3Crect width='6%25' height='70%25' x='4%25' y='15%25' rx='4' /%3E%3Crect width='6%25' height='70%25' x='90%25' y='15%25' rx='4' /%3E%3C/g%3E%3C/svg%3E")`;

export function PackageDetailView({ pkg }: { pkg: PackageDetail }) {
  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi Med Journey, I'd like to know more about "${pkg.title}" (${formatDuration(pkg.duration)}, ${formatPrice(pkg.price)}).`,
  )}`;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <section className="relative min-h-[80svh] flex items-end overflow-hidden">
        <img
          src={pkg.coverImage}
          alt={pkg.title}
          width={1280}
          height={832}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-brand-blue/70 to-brand-blue/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="container-px relative z-10 text-white pb-16 pt-28">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-white/80 mb-6">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/packages" className="hover:text-white">
              Packages
            </Link>
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
              <Calendar className="w-4 h-4" /> {formatDuration(pkg.duration)}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange text-white text-sm font-bold shadow-lg">
              From {formatPrice(pkg.price)}
            </span>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-px grid lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-brand-orange/10 text-brand-orange">
              Overview
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-blue mb-5">
              About this journey
            </h2>
            <p className="text-base sm:text-lg leading-relaxed opacity-80">
              {pkg.overview}
            </p>
          </div>
          <aside className="rounded-3xl p-7 bg-brand-blue text-white shadow-xl h-fit sticky top-24">
            <Sparkles className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-display text-2xl font-bold mb-4">
              Trip Highlights
            </h3>
            <ul className="space-y-3">
              {pkg.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-white/95"
                >
                  <span className="mt-1 grid place-items-center w-5 h-5 rounded-full bg-white/20 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <a
              href="#book"
              className="mt-6 btn-accent w-full bg-white! text-brand-blue!"
              style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,.3)" }}
            >
              Book this trip
            </a>
            {pkg.itineraryPdf && (
              <a
                href={pkg.itineraryPdf}
                download
                className="mt-3 inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition backdrop-blur-sm"
              >
                <Download className="w-4 h-4" />
                Download itinerary PDF
              </a>
            )}
          </aside>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-px">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-brand-orange/15 text-brand-orange">
              Day by Day
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-blue">
              Itinerary
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 sm:hidden top-0 bottom-0 w-0.5 -translate-x-1/2 bg-brand-orange/30" />
            <div className="flex flex-col gap-8 sm:gap-0">
              {pkg.itinerary.map((d, i) => {
                const isEvenDay = (i + 1) % 2 === 0;
                const isLast = i === pkg.itinerary.length - 1;

                return (
                  <Fragment key={d.day}>
                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="absolute left-6 top-10 -translate-x-1/2 w-3 h-3 rounded-full shadow-sm z-10 sm:hidden bg-brand-orange" />

                      <div
                        className={`sm:w-1/2 ml-20 sm:ml-0 sm:px-8 ${isEvenDay ? "sm:order-2" : "sm:order-1"}`}
                      >
                        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md">
                          <div className="text-xs font-semibold tracking-widest uppercase mb-2 text-brand-orange">
                            Day {d.day}
                          </div>
                          <h3 className="font-display text-xl font-bold text-brand-blue mb-2">
                            {d.title}
                          </h3>

                          {d.image && (
                            <img
                              src={d.image}
                              alt={d.title}
                              loading="lazy"
                              className="w-full h-auto object-cover drop-shadow-md mb-4 sm:hidden"
                              style={{
                                WebkitMaskImage: BRUSH_MASK,
                                maskImage: BRUSH_MASK,
                                WebkitMaskSize: "100% 100%",
                                maskSize: "100% 100%",
                              }}
                            />
                          )}

                          <p className="text-sm opacity-75 mb-3 leading-relaxed">
                            {d.description}
                          </p>

                          {d.meals && (
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                              <Utensils className="w-3 h-3" /> {d.meals}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`hidden sm:block sm:w-1/2 sm:px-8 ${isEvenDay ? "sm:order-1" : "sm:order-2"}`}
                      >
                        {d.image && (
                          <img
                            src={d.image}
                            alt={d.title}
                            loading="lazy"
                            className="w-full h-auto object-cover drop-shadow-md"
                            style={{
                              WebkitMaskImage: BRUSH_MASK,
                              maskImage: BRUSH_MASK,
                              WebkitMaskSize: "100% 100%",
                              maskSize: "100% 100%",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {!isLast && (
                      <div className="hidden sm:flex justify-center py-2 opacity-60 text-brand-orange">
                        {!isEvenDay ? (
                          <svg
                            width="360"
                            height="120"
                            viewBox="0 0 360 120"
                            className="drop-shadow-md"
                            style={{
                              stroke: "currentColor",
                              fill: "none",
                              strokeWidth: 4,
                              strokeDasharray: "8 8",
                            }}
                          >
                            <path d="M 60 10 C 60 60, 300 60, 300 95" />
                            <polygon
                              points="288,85 312,85 300,105"
                              style={{ fill: "currentColor", stroke: "none" }}
                            />
                            <rect
                              x="54"
                              y="4"
                              width="12"
                              height="12"
                              rx="3"
                              style={{ fill: "currentColor", stroke: "none" }}
                            />
                          </svg>
                        ) : (
                          <svg
                            width="360"
                            height="120"
                            viewBox="0 0 360 120"
                            className="drop-shadow-md"
                            style={{
                              stroke: "currentColor",
                              fill: "none",
                              strokeWidth: 4,
                              strokeDasharray: "8 8",
                            }}
                          >
                            <path d="M 300 10 C 300 60, 60 60, 60 95" />
                            <polygon
                              points="48,85 72,85 60,105"
                              style={{ fill: "currentColor", stroke: "none" }}
                            />
                            <rect
                              x="294"
                              y="4"
                              width="12"
                              height="12"
                              rx="3"
                              style={{ fill: "currentColor", stroke: "none" }}
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <IncludedSection items={pkg.inclusions} />
      <ExcludedSection items={pkg.exclusions} />
      <TermsSection terms={pkg.termsAndConditions} note={pkg.termsNote} />

      <section className="section-pad bg-brand-blue/5">
        <div className="container-px">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-brand-orange/15 text-brand-orange">
              Gallery
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-blue">
              Through the lens
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {pkg.gallery.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl group ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
              >
                <img
                  src={src}
                  alt={`${pkg.title} ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="section-pad">
        <div className="container-px">
          <div className="rounded-3xl bg-brand-blue text-white p-10 sm:p-14 text-center shadow-2xl relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, #f57c01 0%, transparent 50%)",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Ready to pack your bags?
              </h2>
              <p className="text-white/85 max-w-xl mx-auto mb-8">
                Speak with a travel curator. We&apos;ll tailor dates, hotels,
                and add-ons to make this trip yours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+919876543210" className="btn-accent text-base">
                  <Phone className="w-5 h-5" /> Book Now
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-accent text-base text-white! border-white! hover:bg-white! hover:text-brand-blue!"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:opacity-70"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all packages
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection endpoint="/api/reviews/package" packageId={pkg.id} />

      <section className="section-pad bg-brand-orange/5">
        <div className="container-px max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-brand-orange/15 text-brand-orange">
              Your Turn
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-blue">
              Write a Review
            </h2>
            <p className="mt-3 text-slate-500 text-sm">
              Travelled with us? Share your experience — your review helps other
              travellers.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <WriteReviewSection packageId={pkg.id} />
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
