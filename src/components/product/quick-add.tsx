"use client";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type QuickAddProduct = Pick<
  Product,
  "id" | "slug" | "name" | "price" | "images" | "stock" | "sizes" | "colors"
>;

/**
 * "Quick add" control shown on product cards. Products with sizes open a
 * size picker; other products are added straight away with their first color.
 */
export function QuickAdd({
  product,
  className,
}: {
  product: QuickAddProduct;
  className?: string;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const setOpen = useCartStore((state) => state.setOpen);

  function add(size?: string) {
    const added = addItem({ product, size, color: product.colors[0]?.name });
    if (added === 0) {
      toast.info("Maximum quantity reached", {
        description: `Your bag already holds all available units of ${product.name}.`,
        action: { label: "View bag", onClick: () => setOpen(true) },
      });
      return;
    }
    toast.success("Added to bag", {
      description: [product.name, size].filter(Boolean).join(" · "),
      action: { label: "View bag", onClick: () => setOpen(true) },
    });
  }

  const buttonClassName = cn(
    "w-full rounded-full bg-background/95 text-foreground shadow-sm backdrop-blur hover:bg-background",
    className,
  );

  if (product.stock === 0) {
    return (
      <Button size="sm" variant="secondary" disabled className={buttonClassName}>
        Sold out
      </Button>
    );
  }

  if (product.sizes.length === 0) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={buttonClassName}
        onClick={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <PlusIcon data-icon="inline-start" />
        Quick add
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className={buttonClassName}
          onClick={(event) => event.preventDefault()}
        >
          <PlusIcon data-icon="inline-start" />
          Quick add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40">
        <DropdownMenuLabel>Select a size</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {product.sizes.map((size) => (
          <DropdownMenuItem key={size} onSelect={() => add(size)}>
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
