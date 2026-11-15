import { HeartIcon, PackageSearchIcon, SparklesIcon, ZapIcon } from "lucide-react";

import { ProductImage } from "@/components/product/product-image";

const benefits = [
  {
    icon: PackageSearchIcon,
    title: "Track every order",
    description: "Follow each parcel from our studio to your door and find past receipts in one place.",
  },
  {
    icon: ZapIcon,
    title: "Faster checkout",
    description: "Save your addresses and preferred delivery method to check out in a few taps.",
  },
  {
    icon: HeartIcon,
    title: "Your wishlist, everywhere",
    description: "Saved pieces sync across your phone, tablet and laptop.",
  },
  {
    icon: SparklesIcon,
    title: "Early access",
    description: "Members hear about new drops and the seasonal sale before anyone else.",
  },
];

/** Side panel of the account page: why creating an account is worth it. */
export function AccountBenefits({ image }: { image?: string }) {
  return (
    <aside
      aria-labelledby="account-benefits-heading"
      className="flex flex-col overflow-hidden rounded-2xl border bg-muted/40"
    >
      {image && (
        <div className="relative">
          <ProductImage
            src={image}
            alt=""
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[16/10] rounded-none"
            imageClassName="p-8 sm:p-10"
          />
          <p className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
            Members get first pick of every drop
          </p>
        </div>
      )}
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <h2
          id="account-benefits-heading"
          className="font-display text-3xl tracking-tight text-balance"
        >
          Why create an account?
        </h2>
        <ul className="flex flex-col gap-5">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-4">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full border bg-background"
              >
                <Icon className="size-4.5" strokeWidth={1.75} />
              </span>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-sm text-pretty text-muted-foreground">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
