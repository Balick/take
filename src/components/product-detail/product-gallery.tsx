"use client";

import { useEffect, useRef, useState } from "react";

import { ProductImage } from "@/components/product/product-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const mainImageSizes = "(min-width: 1280px) 720px, (min-width: 1024px) 55vw, 100vw";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

/**
 * Product photos. Desktop: large image with a column of thumbnails.
 * Mobile: a swipeable carousel with dot indicators.
 */
export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = images.length;

  const altFor = (index: number) =>
    count > 1 ? `${productName}, image ${index + 1} of ${count}` : productName;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  function show(index: number) {
    setActive(index);
    // Keep the (hidden) mobile carousel in sync in case the viewport changes.
    api?.scrollTo(index, true);
  }

  function handleThumbnailKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next: number | undefined;
    if (event.key in keys) next = (active + keys[event.key] + count) % count;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (next === undefined) return;

    event.preventDefault();
    show(next);
    thumbnailRefs.current[next]?.focus();
  }

  if (count <= 1) {
    return (
      <div className={className}>
        <ProductImage
          src={images[0]}
          alt={altFor(0)}
          sizes={mainImageSizes}
          preload
          className="rounded-2xl"
          imageClassName="p-8 sm:p-12"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Mobile & tablet: swipeable carousel */}
      <Carousel setApi={setApi} aria-label="Product images" className="lg:hidden">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={`${index}-${src}`} aria-label={`${index + 1} of ${count}`}>
              <ProductImage
                src={src}
                alt={altFor(index)}
                sizes={mainImageSizes}
                preload={index === 0}
                className="rounded-2xl"
                imageClassName="p-8 sm:p-12"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-3 flex justify-center gap-1">
          {images.map((src, index) => (
            <button
              key={`${index}-${src}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${count}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
              className="group/dot flex h-6 min-w-6 items-center justify-center rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full motion-safe:transition-all motion-safe:duration-300",
                  index === active
                    ? "w-6 bg-foreground"
                    : "w-1.5 bg-foreground/25 group-hover/dot:bg-foreground/50",
                )}
              />
            </button>
          ))}
        </div>
      </Carousel>

      {/* Desktop: thumbnails + main image */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[4.5rem_minmax(0,1fr)] xl:grid-cols-[5rem_minmax(0,1fr)]">
        <ul
          aria-label="Product images"
          className="flex flex-col gap-3"
          onKeyDown={handleThumbnailKeyDown}
        >
          {images.map((src, index) => (
            <li key={`${index}-${src}`}>
              <button
                ref={(node) => {
                  thumbnailRefs.current[index] = node;
                }}
                type="button"
                // Roving tabindex: Tab reaches the current thumbnail, arrows move between them.
                tabIndex={index === active ? 0 : -1}
                aria-pressed={index === active}
                aria-label={`Show image ${index + 1} of ${count}`}
                onClick={() => show(index)}
                className="group/thumb block w-full rounded-lg ring-offset-2 ring-offset-background outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-1 aria-pressed:ring-foreground"
              >
                <ProductImage
                  src={src}
                  alt=""
                  sizes="80px"
                  className="rounded-lg"
                  imageClassName="p-1.5 opacity-60 transition-opacity group-hover/thumb:opacity-100 group-aria-pressed/thumb:opacity-100"
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="relative">
          {images.map((src, index) => (
            <div
              key={`${index}-${src}`}
              aria-hidden={index !== active}
              className={cn(
                "motion-safe:transition-opacity motion-safe:duration-500",
                index > 0 && "absolute inset-0",
                index === active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <ProductImage
                src={src}
                alt={altFor(index)}
                sizes={mainImageSizes}
                preload={index === 0}
                className="rounded-2xl"
                imageClassName="p-10 xl:p-14"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Showing image ${active + 1} of ${count}`}
      </p>
    </div>
  );
}
