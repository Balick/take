import { ProductImage } from "@/components/product/product-image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AboutHeroProps {
  images: (string | undefined)[];
}

/** Editorial opening of the About page: the page <h1> and a three-image collage. */
export function AboutHero({ images }: AboutHeroProps) {
  // Deduplicated: with a small catalog, several slots can fall back to the same photo.
  const collage = [...new Set(images.filter((src): src is string => Boolean(src)))];

  return (
    <section aria-labelledby="about-heading" className="container-page pt-12 pb-16 sm:pt-20 sm:pb-24">
      <div className="flex max-w-4xl flex-col gap-6">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          About {siteConfig.name}
        </p>
        <h1
          id="about-heading"
          className="font-display text-5xl leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl"
        >
          Fewer, better things. <em className="text-muted-foreground italic">Made to stay.</em>
        </h1>
        <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
          We design everyday essentials in a monochrome palette, produce them in small batches
          with partners we know by name, and sell them at honest prices. That’s the whole idea.
        </p>
      </div>

      {collage.length > 0 && (
        <div
          className={cn(
            "mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4",
            collage.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {collage.map((src, index) => {
            // On phones the lead image spans the full width and the next two
            // share a row; with only two photos, both span the full width.
            const fullWidthOnPhone = index === 0 || collage.length === 2;
            return (
              <ProductImage
                key={src}
                src={src}
                alt=""
                preload={index === 0}
                sizes={
                  fullWidthOnPhone
                    ? "(min-width: 768px) 33vw, 100vw"
                    : "(min-width: 768px) 33vw, 50vw"
                }
                className={cn(
                  "rounded-2xl",
                  fullWidthOnPhone && "col-span-2 aspect-[4/3] md:col-span-1 md:aspect-[4/5]",
                  collage.length >= 3 && index === 1 && "md:translate-y-12",
                )}
                imageClassName="p-8 sm:p-12"
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
