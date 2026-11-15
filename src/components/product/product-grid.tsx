import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const gridClassName =
  "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGrid({
  products,
  className,
  preloadCount = 0,
}: {
  products: Product[];
  className?: string;
  /** Number of leading images to load eagerly (above the fold). */
  preloadCount?: number;
}) {
  return (
    <div className={cn(gridClassName, className)}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} preload={index < preloadCount} />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full rounded-xl" />
      <div className="flex justify-between gap-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div role="status" className={cn(gridClassName, className)}>
      <span className="sr-only">Loading products…</span>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
