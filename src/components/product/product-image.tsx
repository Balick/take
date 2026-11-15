import Image from "next/image";

import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
}

/**
 * Consistent frame for product shots. The demo photos have white backgrounds,
 * so the frame uses a soft neutral tone and `mix-blend-multiply` to blend them
 * in, in both light and dark mode.
 */
export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  preload,
  className,
  imageClassName,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-200",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn("object-contain p-4 mix-blend-multiply", imageClassName)}
      />
    </div>
  );
}
