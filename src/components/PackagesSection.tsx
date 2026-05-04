import { useEffect, useState } from "react";
import type { PackageSummary } from "@/types";
import PackageCard from "./PackageCard";
import { Search } from "lucide-react";

const PackagesSection = () => {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState("all");
  const [sort, setSort] = useState<"default" | "low" | "high">("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/packages/index.json")
      .then(r => r.json())
      .then(d => setPackages(d.packages || []))
      .finally(() => setLoading(false));
  }, []);

  const allDestinations = Array.from(
    new Set(packages.flatMap(p => p.destination))
  ).sort();

  const parsePrice = (p: string) => Number(p.replace(/[^0-9]/g, "")) || 0;

  const filtered = packages
    .filter(p => p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.shortDescription.toLowerCase().includes(query.toLowerCase()))
    .filter(p => destination === "all" || p.destination.includes(destination))
    .sort((a, b) => {
      if (sort === "low") return parsePrice(a.price) - parsePrice(b.price);
      if (sort === "high") return parsePrice(b.price) - parsePrice(a.price);
      return 0;
    });

  return (
    <section id="packages" className="section-pad theme-bg">
      <div className="container-px">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: "rgb(var(--accent-color) / 0.12)", color: "rgb(var(--accent-color))" }}>
            Curated Journeys
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary mb-4">
            Find your next escape
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Each itinerary is hand-crafted by people who've actually walked the trails — no cookie-cutter tours.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-10 p-3 bg-white rounded-2xl shadow-sm border">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search packages..."
              className="w-full py-2.5 bg-transparent outline-none text-sm"
            />
          </div>
          <select
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-secondary text-sm outline-none"
          >
            <option value="all">All Destinations</option>
            {allDestinations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="px-4 py-2.5 rounded-xl bg-secondary text-sm outline-none"
          >
            <option value="default">Sort: Featured</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6 lg:gap-8">
            {[0,1,2].map(i => (
              <div key={i} className="flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white shadow-sm border animate-pulse">
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[280px] bg-muted shrink-0" />
                <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                  <div className="h-10 bg-muted rounded w-full md:w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No packages match your search.</p>
        ) : (
          <div className="flex flex-col gap-6 lg:gap-8">
            {filtered.map((p, i) => <PackageCard key={p.id} pkg={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default PackagesSection;
