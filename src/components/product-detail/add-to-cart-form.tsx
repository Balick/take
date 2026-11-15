"use client";

import { BellIcon, ShoppingBagIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { QuantityInput } from "@/components/cart/quantity-input";
import { MobileAddToBagBar } from "@/components/product-detail/mobile-add-to-bag-bar";
import { SizeGuideDialog } from "@/components/product-detail/size-guide-dialog";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getProductLimit, useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/** Below this stock level, show an "Only N left" urgency message. */
const LOW_STOCK_THRESHOLD = 5;
/** Height of the sticky site header, so the mobile bar appears on time. */
const HEADER_OFFSET = 64;

type PurchasableProduct = Pick<
  Product,
  "id" | "slug" | "name" | "price" | "compareAtPrice" | "images" | "stock" | "sizes" | "colors"
>;

interface AddToCartFormProps {
  product: PurchasableProduct;
  className?: string;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AddToCartForm({ product, className }: AddToCartFormProps) {
  const id = useId();
  const colorLabelId = `${id}-color`;
  const sizeLabelId = `${id}-size`;
  const sizeErrorId = `${id}-size-error`;

  const [color, setColor] = useState(product.colors[0]?.name);
  // Nothing to choose when there is a single size (e.g. "One size").
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  const sizeFieldRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;
  const needsSize = product.sizes.length > 0;
  // Units of this product already in the bag, all variants combined, count
  // against the per-product limit.
  const unitsInBag = useCartStore((state) =>
    state.items
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0),
  );
  const maxQuantity = Math.max(1, getProductLimit(product.stock) - unitsInBag);
  const selectedQuantity = Math.min(quantity, maxQuantity);

  // Reveal the mobile bar once the main button has scrolled past the top, and
  // tuck it away again when the site footer comes into view so it never hides
  // the footer links.
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions) return;

    let pastActions = false;
    let footerInView = false;
    const update = () => setShowMobileBar(pastActions && !footerInView);

    const actionsObserver = new IntersectionObserver(
      ([entry]) => {
        pastActions = !entry.isIntersecting && entry.boundingClientRect.top < HEADER_OFFSET;
        update();
      },
      { rootMargin: `-${HEADER_OFFSET}px 0px 0px 0px` },
    );
    actionsObserver.observe(actions);

    const footer = Array.from(document.querySelectorAll("footer")).find(
      (element) => !element.closest("main"),
    );
    const footerObserver = new IntersectionObserver(([entry]) => {
      footerInView = entry.isIntersecting;
      update();
    });
    if (footer) footerObserver.observe(footer);

    return () => {
      actionsObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  function revealSizeError() {
    setShowSizeError(true);
    const field = sizeFieldRef.current;
    if (!field) return;
    field.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
    field.querySelector<HTMLButtonElement>("[data-slot=toggle-group-item]")?.focus({
      preventScroll: true,
    });
  }

  function addToBag() {
    if (soldOut) return;
    if (needsSize && !size) {
      revealSizeError();
      return;
    }

    const { addItem, setOpen } = useCartStore.getState();
    const added = addItem({ product, color, size, quantity: selectedQuantity });
    if (added === 0) {
      toast.info("Maximum quantity reached", {
        description: `Your bag already holds all available units of ${product.name}.`,
      });
      return;
    }

    // The cart sheet opening (and taking focus) is the confirmation: a toast
    // only when fewer units than requested could be added.
    setOpen(true);
    if (added < selectedQuantity) {
      toast.info(`Only ${added} ${added === 1 ? "unit" : "units"} could be added`, {
        description: `Your bag now holds all available units of ${product.name}.`,
      });
    }
  }

  function notifyMe() {
    toast.success("You're on the list", {
      description: `We'll let you know as soon as the ${product.name} is back in stock.`,
    });
  }

  const variantSummary = [color, size].filter(Boolean).join(" · ");

  return (
    <>
      <form
        noValidate
        aria-label={`Purchase options for ${product.name}`}
        className={cn("flex flex-col gap-6", className)}
        onSubmit={(event) => {
          event.preventDefault();
          addToBag();
        }}
      >
        {product.colors.length > 0 && (
          <Field className="gap-3">
            <FieldTitle id={colorLabelId}>
              Color
              {/* Hidden from the group's name: the checked swatch already announces it. */}
              <span aria-hidden className="font-normal text-muted-foreground">
                {color}
              </span>
            </FieldTitle>
            <RadioGroup
              value={color}
              onValueChange={setColor}
              aria-labelledby={colorLabelId}
              className="flex w-auto flex-wrap gap-3"
            >
              {product.colors.map((option) => (
                <RadioGroupItem
                  key={option.name}
                  value={option.name}
                  aria-label={option.name}
                  title={option.name}
                  style={{ backgroundColor: option.value }}
                  className={cn(
                    "size-8 cursor-pointer border-foreground/15 shadow-xs after:hidden *:data-[slot=radio-group-indicator]:hidden",
                    "ring-offset-2 ring-offset-background transition-shadow",
                    "focus-visible:border-foreground/15 focus-visible:ring-2 focus-visible:ring-ring",
                    "focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-ring",
                    "data-checked:border-foreground/15 data-checked:ring-2 data-checked:ring-foreground",
                  )}
                />
              ))}
            </RadioGroup>
          </Field>
        )}

        {needsSize && (
          <Field
            ref={sizeFieldRef}
            data-invalid={showSizeError && !size}
            className="scroll-mt-28 gap-3"
          >
            <div className="flex items-center justify-between gap-4">
              <FieldTitle id={sizeLabelId}>
                Size
                {size && (
                  <span aria-hidden className="font-normal text-muted-foreground">
                    {size}
                  </span>
                )}
              </FieldTitle>
              <SizeGuideDialog productName={product.name} />
            </div>
            <ToggleGroup
              type="single"
              variant="outline"
              size="lg"
              value={size ?? ""}
              onValueChange={(value) => {
                // A size is required: ignore attempts to deselect.
                if (!value) return;
                setSize(value);
                setShowSizeError(false);
              }}
              aria-labelledby={sizeLabelId}
              aria-required
              aria-invalid={showSizeError && !size}
              aria-describedby={showSizeError && !size ? sizeErrorId : undefined}
              className="flex w-full flex-wrap"
            >
              {product.sizes.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  disabled={soldOut}
                  className={cn(
                    "h-11 min-w-14 flex-1 rounded-lg text-sm sm:flex-none",
                    "data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background",
                    showSizeError && !size && "border-destructive/60",
                  )}
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {showSizeError && !size && (
              <FieldError id={sizeErrorId}>Please select a size to continue.</FieldError>
            )}
          </Field>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          {!soldOut && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium" aria-hidden>
                Quantity
              </span>
              <QuantityInput
                value={selectedQuantity}
                onChange={setQuantity}
                max={maxQuantity}
                label="Quantity"
              />
            </div>
          )}
          <StockStatus stock={product.stock} soldOut={soldOut} lowStock={lowStock} />
        </div>

        <div className="flex flex-col gap-3">
          <div ref={actionsRef} className="flex gap-2">
            <Button
              type="submit"
              size="lg"
              disabled={soldOut}
              className="h-11 flex-1 rounded-full text-sm"
            >
              {!soldOut && <ShoppingBagIcon data-icon="inline-start" />}
              {soldOut ? "Sold out" : "Add to bag"}
            </Button>
            <WishlistButton
              productId={product.id}
              productName={product.name}
              variant="outline"
              className="size-11 rounded-full"
            />
          </div>

          {soldOut && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 rounded-full"
              onClick={notifyMe}
            >
              <BellIcon data-icon="inline-start" />
              Notify me when it&apos;s back
            </Button>
          )}
        </div>
      </form>

      <MobileAddToBagBar
        visible={showMobileBar}
        name={product.name}
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        variant={variantSummary || undefined}
        soldOut={soldOut}
        onAdd={addToBag}
      />
    </>
  );
}

function StockStatus({
  stock,
  soldOut,
  lowStock,
}: {
  stock: number;
  soldOut: boolean;
  lowStock: boolean;
}) {
  return (
    <p className="flex items-center gap-2 text-sm">
      <span
        aria-hidden
        className={cn(
          "relative flex size-2 rounded-full",
          soldOut ? "bg-muted-foreground/50" : lowStock ? "bg-sale" : "bg-success",
        )}
      >
        {lowStock && (
          <span className="absolute inset-0 rounded-full bg-sale opacity-75 motion-safe:animate-ping" />
        )}
      </span>
      {soldOut ? (
        <span className="text-muted-foreground">Out of stock, back soon</span>
      ) : lowStock ? (
        <span className="font-medium text-sale">Only {stock} left in stock</span>
      ) : (
        <span className="text-muted-foreground">In stock, ships within one business day</span>
      )}
    </p>
  );
}
