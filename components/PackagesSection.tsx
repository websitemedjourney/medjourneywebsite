"use client";
import { useEffect, useState } from "react";
import { PackageSummary } from "@/app/types";
import PackageCard from "./PackageCard";
import Link from "next/link";

const PackagesSection = () => {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/packages/index.json")
      .then((r) => r.json())
      .then((d) => setPackages(d.packages || []))
      .finally(() => setLoading(false));
  }, []);

  const featuredPackages = packages.slice(0, 3);

  return (
    <section id="packages" className="section-pad theme-bg">
      <div className="container-px">
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{
              background: "rgb(var(--accent-color) / 0.12)",
              color: "rgb(var(--accent-color))",
            }}
          >
            Curated Journeys
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary mb-4">
            Find your next escape
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Each itinerary is hand-crafted by people who've actually walked the
            trails — no cookie-cutter tours.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6 lg:gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white shadow-sm border animate-pulse"
              >
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[280px] bg-muted shrink-0" />
                <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                  <div className="h-10 bg-muted rounded w-full md:w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredPackages.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No packages found.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-6 lg:gap-8">
              {featuredPackages.map((p, i) => (
                <PackageCard key={p.id} pkg={p} index={i} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium transition-colors rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                View All Packages
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PackagesSection;
