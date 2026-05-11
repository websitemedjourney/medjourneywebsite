import TravelerSilhouette from "./TravelerSilhouette";

const ExcludedSection = ({ items }: { items: string[] }) => (
  <section className="relative overflow-hidden py-16 lg:py-20 bg-brand-orange">
    <TravelerSilhouette
      mirrored
      className="absolute -left-10 sm:left-0 bottom-0 h-full w-auto pointer-events-none text-white/90"
      color="white"
    />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(circle at 20% 50%, rgb(255 255 255 / 0.12), transparent 60%)" }}
    />

    <div className="container-px relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div aria-hidden className="hidden lg:block" />
        <div className="text-white">
          <h2 className="font-display text-4xl font-bold mb-6 tracking-tight text-left">
            Package Exclusions
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
      </div>
    </div>
  </section>
);

export default ExcludedSection;
