import TravelerSilhouette from "./TravelerSilhouette";

const IncludedSection = ({ items }: { items: string[] }) => (
  <section
    className="relative overflow-hidden py-16 lg:py-20"
    style={{ backgroundColor: "rgb(var(--primary-color))" }}
  >
    {/* Decorative silhouette */}
    <TravelerSilhouette
      className="absolute right-[-40px] sm:right-0 bottom-0 h-[100%] w-auto pointer-events-none"
      color={`rgb(var(--accent-color))`}
    />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(circle at 80% 50%, rgb(var(--accent-color) / 0.1), transparent 60%)" }}
    />

    <div className="container-px relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <h2 className="font-display text-4xl font-bold mb-6 tracking-tight">
            Package Inclusions
          </h2>
          <ul className="space-y-2 list-disc list-outside ml-5">
            {items.map((item) => (
              <li
                key={item}
                className="text-sm sm:text-base leading-relaxed text-white/95"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="hidden lg:block" />
      </div>
    </div>
  </section>
);

export default IncludedSection;
