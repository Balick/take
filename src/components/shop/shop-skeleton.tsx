import { ProductGridSkeleton } from "@/components/product/product-grid";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Static-shell fallback for the listing: mirrors the final layout (header,
 * sidebar, toolbar, grid) so nothing shifts when the results stream in.
 */
export function ShopSkeleton() {
  return (
    <div className="motion-reduce:[&_*]:animate-none">
      <p role="status" className="sr-only">
        Loading products…
      </p>
      <div className="flex flex-col gap-4 pt-8 pb-8 sm:pt-12">
        <Skeleton className="h-4 w-36" />
        <div className="flex max-w-2xl flex-col gap-3">
          <Skeleton className="h-10 w-56 sm:h-12" />
          <Skeleton className="h-5 w-full max-w-md" />
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        <div className="hidden flex-col gap-6 lg:flex">
          <Skeleton className="h-3 w-20" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
          <Separator />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-1 w-full" />
          <Separator />
          <Skeleton className="h-3 w-24" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-9 w-full sm:max-w-xs" />
            <div className="flex justify-between gap-2">
              <Skeleton className="h-9 w-24 lg:hidden" />
              <Skeleton className="h-9 w-44" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
          <ProductGridSkeleton count={6} className="xl:grid-cols-3" />
        </div>
      </div>
    </div>
  );
}
