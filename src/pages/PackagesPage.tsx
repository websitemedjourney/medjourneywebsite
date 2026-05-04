import { useEffect, useState } from "react";
import type { PackageSummary } from "@/types";
import PackageCard from "@/components/PackageCard";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PackagesPage = () => {
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "low" | "high" | "short" | "long">("default");
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 rows of 3 columns

  useEffect(() => {
    // Scroll to top when loading the page
    window.scrollTo(0, 0);
    
    fetch("/packages/index.json")
      .then(r => r.json())
      .then(d => setPackages(d.packages || []))
      .finally(() => setLoading(false));
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, sort]);

  const parsePrice = (p: string) => Number(p.replace(/[^\d]/g, "")) || 0;
  const parseDuration = (d: string) => Number(d.split(" ")[0]) || 0;

  const filtered = packages
    .filter(p => p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.destination.join(" ").toLowerCase().includes(query.toLowerCase()));

  const sortedPackages = [...filtered].sort((a, b) => {
    if (sort === "low") return parsePrice(a.price) - parsePrice(b.price);
    if (sort === "high") return parsePrice(b.price) - parsePrice(a.price);
    if (sort === "short") return parseDuration(a.duration) - parseDuration(b.duration);
    if (sort === "long") return parseDuration(b.duration) - parseDuration(a.duration);
    return 0;
  });

  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage);
  const paginatedPackages = sortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-24 pb-20 theme-bg">
        <div className="container-px">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary mb-4">
              All Travel Packages
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              Explore our complete collection of hand-crafted itineraries and find your perfect journey.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-10 p-3 bg-white rounded-2xl shadow-sm border max-w-6xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title or destination..."
                className="w-full py-2.5 bg-transparent outline-none text-sm"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="px-4 py-2.5 rounded-xl bg-secondary text-sm outline-none border-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="default">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="short">Duration: Short to Long</option>
              <option value="long">Duration: Long to Short</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[0,1,2].map(i => (
                <div key={i} className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-sm border animate-pulse">
                  <div className="w-full aspect-[4/3] bg-muted shrink-0" />
                  <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                    <div className="h-10 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedPackages.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 theme-text-primary">No packages found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any packages matching your search criteria. Try adjusting your filters.
              </p>
              <button 
                onClick={() => { setQuery(''); setSort('default'); }}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium transition-colors rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedPackages.map((p, i) => <PackageCard key={p.id} pkg={p} index={i} layout="grid" />)}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          currentPage === i + 1 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-secondary border"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PackagesPage;
