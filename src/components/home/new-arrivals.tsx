import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getNewArrivals } from "@/lib/queries";

/** Moves the controls from their default absolute position into the header row. */
const controlClassName = "static inset-auto m-0";

/**
 * The carousel primitives are client components, but the slides themselves
 * are server-rendered ProductCards passed as children: only Embla and the
 * card's interactive leaves (quick add, wishlist) ship JavaScript.
 */
export async function NewArrivals() {
  const products = await getNewArrivals(8);

  if (products.length === 0) return null;

  return (
    <section className="container-page py-16 sm:py-24">
      <Carousel opts={{ align: "start" }} aria-label="New arrivals">
        <div className="mb-8 flex items-end gap-4 sm:mb-10">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals"
            description="The newest additions to our permanent collection, made in small batches."
            link={{ href: "/products?sort=newest", label: "Shop new arrivals" }}
            className="mb-0 flex-1 sm:mb-0"
          />
          <div className="flex shrink-0 gap-2">
            <CarouselPrevious size="icon-lg" className={controlClassName} />
            <CarouselNext size="icon-lg" className={controlClassName} />
          </div>
        </div>

        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem
              key={product.id}
              aria-label={`${index + 1} of ${products.length}`}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
