import TravelerSilhouette from "./TravelerSilhouette";

const ExcludedSection = ({ items }: { items: string[] }) => (
  <section
    className="relative overflow-hidden py-20 lg:py-28"
    style={{ backgroundColor: "rgb(var(--accent-color))" }}
  >
    <TravelerSilhouette
      mirrored
      className="absolute left-[-40px] sm:left-0 top-1/2 -translate-y-1/2 h-[80%] w-auto pointer-events-none text-white/90"
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
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-8 tracking-tight lg:text-right">
            What's Not Included
          </h2>
          <ul className="space-y-3.5">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-white/95"
              >
                <span className="mt-2.5 w-2 h-2 rounded-full shrink-0 bg-white" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default ExcludedSection;
