import type { TermsAndConditions } from "@/types";

const LABELS: Record<keyof TermsAndConditions, string> = {
  paymentPolicy: "Payment Policy",
  hotelPolicy: "Hotel Policy",
  transportationPolicy: "Transportation Policy",
  cancellationPolicy: "Cancellation Policy",
  childPolicy: "Child Policy",
};

const TermsSection = ({ terms, note }: { terms?: TermsAndConditions; note?: string }) => {
  if (!terms) return null;
  const groups = (Object.keys(LABELS) as (keyof TermsAndConditions)[])
    .filter((k) => terms[k] && terms[k]!.length > 0);

  return (
    <section className="theme-bg py-20 lg:py-28">
      <div className="container-px max-w-4xl">
        {note && (
          <p className="text-base sm:text-lg leading-[1.7] opacity-80 mb-12">
            {note}
          </p>
        )}

        <h2 className="font-display text-4xl sm:text-5xl font-bold theme-text-primary mb-10 tracking-tight">
          Terms &amp; Conditions
        </h2>

        <div className="space-y-9">
          {groups.map((key) => (
            <div key={key}>
              <h3 className="font-semibold text-lg sm:text-xl theme-text-primary mb-3">
                {LABELS[key]}
              </h3>
              <ul className="space-y-2.5 pl-5 list-disc marker:opacity-60">
                {terms[key]!.map((line) => (
                  <li
                    key={String(key) + line}
                    className="text-base leading-[1.7] opacity-85"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
