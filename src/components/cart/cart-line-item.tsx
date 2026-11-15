"use client";

import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { QuantityInput } from "@/components/cart/quantity-input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getLineMax, useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CartLineItemProps {
  item: CartItem;
  /** Read-only lines are used in the checkout summary. */
  readOnly?: boolean;
  /** Called when the user follows the product link (e.g. to close a sheet). */
  onNavigate?: () => void;
  className?: string;
}

export function CartLineItem({ item, readOnly, onNavigate, className }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const maxQuantity = useCartStore((state) => getLineMax(state.items, item));
  const variant = [item.color, item.size].filter(Boolean).join(" / ");

  return (
    <li className={cn("flex gap-4", className)}>
      <Link
        href={`/products/${item.slug}`}
        onClick={onNavigate}
        className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-200"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="80px"
          className="object-contain p-1.5 mix-blend-multiply"
        />
        {readOnly && (
          <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-lg bg-foreground text-[0.65rem] font-medium text-background">
            {item.quantity}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              onClick={onNavigate}
              className="line-clamp-1 text-sm font-medium underline-offset-4 hover:underline"
            >
              {item.name}
            </Link>
            {variant && <p className="text-sm text-muted-foreground">{variant}</p>}
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {readOnly ? (
          <p className="text-sm text-muted-foreground">
            {item.quantity} × {formatPrice(item.price)}
          </p>
        ) : (
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <QuantityInput
              size="sm"
              value={item.quantity}
              max={maxQuantity}
              label={`Quantity for ${item.name}`}
              onChange={(quantity) => updateQuantity(item.id, quantity)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from bag`}
            >
              <Trash2Icon data-icon="inline-start" aria-hidden />
              Remove
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
