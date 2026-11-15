import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { getCategories, getProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function CategoryGrid() {
  const categories = await getCategories();
  const counts = await Promise.all(
    categories.map(async (category) => (await getProducts({ category: category.slug })).length),
  );

  if (categories.length === 0) return null;

  return (
    <section className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow="Collections"
        title="Shop by category"
        description="From heavyweight tees to insulated bottles, everything is designed to work together."
        link={{ href: "/products", label: "Browse everything" }}
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {categories.map((category, index) => {
          const isLead = index === 0;
          const count = counts[index];

          return (
            <li key={category.slug} className={cn(isLead && "col-span-2 md:row-span-2")}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group/tile relative flex h-full overflow-hidden rounded-2xl bg-neutral-100 ring-offset-2 ring-offset-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-neutral-200"
              >
                <div
                  className={cn(
                    "relative w-full",
                    isLead ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-80" : "aspect-square",
                  )}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes={
                      isLead
                        ? "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
                        : "(min-width: 1280px) 320px, (min-width: 768px) 25vw, 50vw"
                    }
                    className={cn(
                      "object-contain mix-blend-multiply transition-transform duration-700 ease-out motion-safe:group-hover/tile:scale-105",
                      // Bottom padding keeps the product clear of the label card.
                      isLead
                        ? "p-10 pb-20 sm:p-16 sm:pb-24 md:pb-32"
                        : "p-6 pb-20 sm:p-10 sm:pb-20",
                    )}
                  />
                </div>

                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-3 rounded-xl bg-background/90 px-3 py-2.5 text-foreground backdrop-blur sm:inset-x-3 sm:bottom-3 sm:px-4 sm:py-3">
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={cn("truncate font-medium", isLead ? "text-base" : "text-sm")}
                    >
                      {category.name}
                    </span>
                    {isLead && (
                      <span className="hidden text-sm text-muted-foreground md:block">
                        {category.description}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {count} {count === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 motion-safe:group-hover/tile:rotate-45",
                      // Small tiles are ~160px wide on phones and at md: give the name the room.
                      isLead ? "grid" : "hidden sm:grid md:hidden lg:grid",
                    )}
                    aria-hidden
                  >
                    <ArrowUpRightIcon className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
