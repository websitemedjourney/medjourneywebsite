"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Review } from "@/app/types";
import { StarDisplay } from "./StarRating";
import WriteReviewSection from "./WriteReviewSection";

const ReviewsSection = ({
  endpoint = "/api/reviews",
  packageId,
}: {
  endpoint?: string;
  packageId?: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [idx, setIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const url = packageId ? `${endpoint}?packageId=${encodeURIComponent(packageId)}` : endpoint;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []));
  }, [endpoint, packageId]);

  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 5500);
    return () => clearInterval(t);
  }, [reviews.length]);

  const next = () => setIdx((i) => (i + 1) % reviews.length);
  const prev = () =>
    setIdx((i) => (i - 1 + reviews.length) % reviews.length);

  const visible =
    reviews.length >= 3
      ? [
          reviews[idx],
          reviews[(idx + 1) % reviews.length],
          reviews[(idx + 2) % reviews.length],
        ]
      : reviews;

  return (
    <section
      id="reviews"
      className="section-pad bg-linear-to-br from-brand-blue to-blue-950 text-white relative overflow-hidden"
    >
      <Quote className="absolute -top-10 -left-10 w-72 h-72 text-white/5" />
      <div className="container-px relative">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 bg-white/15 text-white">
            Travellers Speak
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            Stories from the road
          </h2>
        </div>

        {visible.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {visible.map((r, i) => (
                <article
                  key={`${r.id ?? r.name}-${idx}-${i}`}
                  className="rounded-3xl bg-white/10 backdrop-blur-md p-7 fade-in border border-white/15"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="mb-4">
                    <StarDisplay rating={r.rating} size={18} />
                  </div>
                  <p className="text-white/95 leading-relaxed mb-6 min-h-[5rem]">
                    &quot;{r.review}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-xs text-white/60">
                        Verified Traveller
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="grid place-items-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1.5">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Go to ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === idx ? "w-8 bg-white" : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="grid place-items-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Write a review */}
        <div className="mt-16 max-w-2xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/25 transition"
              >
                ✍️ Share your experience
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-8 text-slate-900">
              <h3 className="font-display text-2xl font-bold text-brand-blue mb-6">
                Write a Review
              </h3>
              <WriteReviewSection packageId={packageId} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
