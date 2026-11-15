import { isOrderId } from "@/components/checkout/order-id";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderNumberProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Reads the order number from the URL. `searchParams` is runtime data, so
 * this component must be rendered inside a <Suspense> boundary.
 */
export async function OrderNumber({ searchParams }: OrderNumberProps) {
  const { order } = await searchParams;

  if (!isOrderId(order)) {
    return (
      <p className="text-sm text-muted-foreground">
        Your order number is included in your confirmation email.
      </p>
    );
  }

  return (
    <div className="inline-flex flex-col items-center gap-1 rounded-xl border bg-muted/40 px-6 py-3">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Order number
      </p>
      <p className="font-mono text-lg font-medium tracking-wider select-all">{order}</p>
    </div>
  );
}

export function OrderNumberSkeleton() {
  return (
    <div
      role="status"
      className="inline-flex flex-col items-center gap-2 rounded-xl border px-6 py-3"
    >
      <span className="sr-only">Loading order number…</span>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-36" />
    </div>
  );
}
