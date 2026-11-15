import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder for the product page while the product streams in. */
export function ProductDetailSkeleton() {
  return (
    <div className="container-page pt-6 pb-16 sm:pt-8 sm:pb-24" aria-busy="true">
      <span className="sr-only">Loading product…</span>
      <Skeleton className="h-4 w-64 max-w-full" />

      <div className="mt-6 grid gap-10 sm:mt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 xl:gap-20">
        <div className="lg:grid lg:grid-cols-[4.5rem_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[5rem_minmax(0,1fr)]">
          <div className="hidden flex-col gap-3 lg:flex">
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
          </div>
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-28" />
          <div className="mt-2 flex flex-col gap-2 border-t pt-6">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
          </div>
          <div className="mt-6 flex gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-11 flex-1 rounded-lg" />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="size-11 rounded-full" />
          </div>
          <Skeleton className="mt-6 h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
