import { Badge } from "@/components/ui/badge";
import { discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const badgeLabels = {
  new: "New",
  bestseller: "Best seller",
  limited: "Limited",
} as const;

export function ProductBadges({
  product,
  className,
}: {
  product: Pick<Product, "badges" | "price" | "compareAtPrice" | "stock">;
  className?: string;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;

  if (!soldOut && discount === 0 && product.badges.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {soldOut && <Badge variant="secondary">Sold out</Badge>}
      {!soldOut && discount > 0 && (
        <Badge className="bg-sale text-sale-foreground">-{discount}%</Badge>
      )}
      {product.badges.map((badge) => (
        <Badge
          key={badge}
          variant="outline"
          className="border-transparent bg-background/90 backdrop-blur"
        >
          {badgeLabels[badge]}
        </Badge>
      ))}
    </div>
  );
}
