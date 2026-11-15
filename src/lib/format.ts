import { siteConfig } from "@/config/site";

const currencyFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // "$45" for whole amounts, "$3.60" otherwise.
  trailingZeroDisplay: "stripIfInteger",
});

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}

export function isOnSale(product: { price: number; compareAtPrice?: number }) {
  return product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
}

export function formatDate(isoDate: string) {
  // ISO dates without a time are parsed as UTC midnight: format them in UTC
  // too, otherwise servers west of UTC would display the previous day.
  return new Intl.DateTimeFormat(siteConfig.locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Shipping, tax and total for a given subtotal. */
export function getOrderTotals(subtotal: number) {
  const shipping =
    subtotal === 0 || subtotal >= siteConfig.freeShippingThreshold
      ? 0
      : siteConfig.shippingCost;
  const tax = Math.round(subtotal * siteConfig.taxRate * 100) / 100;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
