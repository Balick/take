import { siteConfig } from "@/config/site";

interface AboutNumbersProps {
  productCount: number;
  reviewCount: number;
  rating: number;
}

/** Key figures. Catalog-based numbers are computed, so they never overpromise. */
export function AboutNumbers({ productCount, reviewCount, rating }: AboutNumbersProps) {
  const figures = [
    { value: String(productCount), label: "Essentials in the permanent collection" },
    { value: "100%", label: "Cotton in every tee and long sleeve" },
    ...(reviewCount > 0
      ? [
          {
            value: rating.toFixed(1),
            label: `Average rating across ${new Intl.NumberFormat(siteConfig.locale).format(reviewCount)} reviews`,
          },
        ]
      : []),
    {
      value: String(siteConfig.returnWindowDays),
      label: "Days to return anything, free of charge",
    },
  ];

  return (
    <section aria-labelledby="numbers-heading" className="container-page py-16 sm:py-24">
      <h2 id="numbers-heading" className="sr-only">
        {siteConfig.name} in numbers
      </h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t pt-10 lg:grid-cols-4">
        {figures.map((figure) => (
          <div key={figure.label} className="flex flex-col-reverse gap-2">
            <dt className="max-w-[16rem] text-sm text-pretty text-muted-foreground">
              {figure.label}
            </dt>
            <dd className="font-display text-6xl leading-none tracking-tight tabular-nums sm:text-7xl">
              {figure.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
