import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { PackageSummary } from "@/types";

const PackageCard = ({ pkg, index }: { pkg: PackageSummary; index: number }) => {
  return (
    <Link
      to={`/package/${pkg.id}`}
      className="group flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative w-full md:w-2/5 shrink-0 aspect-[4/3] md:aspect-auto md:min-h-[280px] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          width={1280}
          height={832}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
          style={{ backgroundColor: pkg.accentColor || "rgb(var(--accent-color))" }}
        >
          {pkg.duration}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-1.5 text-xs opacity-90 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{pkg.destination.join(" • ")}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight">
            {pkg.title}
          </h3>
        </div>
      </div>

      <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 mb-4 md:mb-6">{pkg.shortDescription}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="font-display text-2xl font-bold theme-text-primary">{pkg.price}</div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3"
            style={{ color: pkg.accentColor || "rgb(var(--accent-color))" }}
          >
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" /> {pkg.duration} of unforgettable memories
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
