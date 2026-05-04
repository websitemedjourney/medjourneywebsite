import type { TermsAndConditions } from "@/app/types";

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
    <section className="bg-white py-12 lg:py-16">
      <div className="container-px max-w-4xl">


        <h2 className="font-display text-3xl sm:text-4xl font-bold theme-text-primary mb-8 tracking-tight">
          Terms &amp; Conditions
        </h2>

        <div className="space-y-8">
          {groups.map((key) => (
            <div key={key}>
              <h3 className="font-bold text-base sm:text-lg theme-text-primary mb-2">
                {LABELS[key]}
              </h3>
              <ul className="space-y-1.5 pl-5 list-disc marker:text-gray-600">
                {terms[key]!.map((line) => (
                  <li
                    key={String(key) + line}
                    className="text-sm sm:text-base leading-relaxed text-gray-700"
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
