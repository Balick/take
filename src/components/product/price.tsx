import { discountPercent, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "default" | "lg";
  showDiscount?: boolean;
  className?: string;
}

export function Price({
  price,
  compareAtPrice,
  size = "default",
  showDiscount = false,
  className,
}: PriceProps) {
  const discount = discountPercent(price, compareAtPrice);

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-medium tabular-nums",
          size === "sm" && "text-sm",
          size === "lg" && "text-2xl",
          discount > 0 && "text-sale",
        )}
      >
        <span className="sr-only">{discount > 0 ? "Sale price: " : "Price: "}</span>
        {formatPrice(price)}
      </span>
      {discount > 0 && (
        <>
          <span
            className={cn(
              "text-muted-foreground tabular-nums line-through",
              size === "lg" ? "text-base" : "text-sm",
            )}
          >
            <span className="sr-only">Original price: </span>
            {formatPrice(compareAtPrice!)}
          </span>
          {showDiscount && (
            <span className="rounded-full bg-sale px-2 py-0.5 text-xs font-medium text-sale-foreground">
              Save {discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
