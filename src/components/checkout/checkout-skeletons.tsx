import { Skeleton } from "@/components/ui/skeleton";

function LineItemSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className="flex gap-4">
      <Skeleton className="aspect-[4/5] w-20 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-3.5 w-1/4" />
        {!compact && <Skeleton className="mt-auto h-7 w-24 rounded-full" />}
      </div>
    </div>
  );
}

function SummaryCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border p-6 lg:self-start">
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-1.5 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}

/** Placeholder of the cart page while the bag is restored from storage. */
export function CartPageSkeleton() {
  return (
    <div
      role="status"
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_26rem]"
    >
      <span className="sr-only">Loading your bag…</span>
      <div className="flex flex-col divide-y border-y">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="py-6">
            <LineItemSkeleton />
          </div>
        ))}
      </div>
      <SummaryCardSkeleton />
    </div>
  );
}

/** Placeholder of the checkout page while the bag is restored from storage. */
export function CheckoutPageSkeleton() {
  return (
    <div
      role="status"
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 xl:gap-20"
    >
      <span className="sr-only">Loading checkout…</span>
      <div className="flex flex-col gap-10">
        {Array.from({ length: 3 }, (_, section) => (
          <div key={section} className="flex flex-col gap-5 border-t pt-10 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: section === 0 ? 1 : 4 }, (_, field) => (
                <div key={field} className="flex flex-col gap-2 sm:first:col-span-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-6 rounded-2xl border p-6 lg:self-start">
        <Skeleton className="h-5 w-32" />
        <LineItemSkeleton compact />
        <LineItemSkeleton compact />
        <Skeleton className="h-px w-full" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
