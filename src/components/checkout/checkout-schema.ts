import { z } from "zod";

import { siteConfig } from "@/config/site";
import { getOrderTotals } from "@/lib/format";
import type { CartItem } from "@/types";

/* -------------------------------------------------------------------------- */
/*                                  Countries                                 */
/* -------------------------------------------------------------------------- */

export interface CheckoutCountry {
  code: string;
  name: string;
  /** Label of the "state" field for this country. */
  regionLabel: string;
  /** Label of the "postal code" field for this country. */
  postalLabel: string;
  /** Whether addresses in this country need a state / province. */
  requiresRegion: boolean;
  /** Whether this country uses postal codes. */
  requiresPostalCode: boolean;
}

/** Countries the demo store ships to. Add or remove entries freely. */
export const countries = [
  {
    code: "US",
    name: "United States",
    regionLabel: "State",
    postalLabel: "ZIP code",
    requiresRegion: true,
    requiresPostalCode: true,
  },
  {
    code: "CA",
    name: "Canada",
    regionLabel: "Province",
    postalLabel: "Postal code",
    requiresRegion: true,
    requiresPostalCode: true,
  },
  {
    code: "GB",
    name: "United Kingdom",
    regionLabel: "County",
    postalLabel: "Postcode",
    requiresRegion: false,
    requiresPostalCode: true,
  },
  {
    code: "FR",
    name: "France",
    regionLabel: "Region",
    postalLabel: "Postal code",
    requiresRegion: false,
    requiresPostalCode: true,
  },
  {
    code: "DE",
    name: "Germany",
    regionLabel: "State",
    postalLabel: "Postal code",
    requiresRegion: false,
    requiresPostalCode: true,
  },
  {
    code: "BE",
    name: "Belgium",
    regionLabel: "Province",
    postalLabel: "Postal code",
    requiresRegion: false,
    requiresPostalCode: true,
  },
  {
    code: "NL",
    name: "Netherlands",
    regionLabel: "Province",
    postalLabel: "Postal code",
    requiresRegion: false,
    requiresPostalCode: true,
  },
  {
    code: "ES",
    name: "Spain",
    regionLabel: "Province",
    postalLabel: "Postal code",
    requiresRegion: true,
    requiresPostalCode: true,
  },
  {
    code: "IT",
    name: "Italy",
    regionLabel: "Province",
    postalLabel: "Postal code",
    requiresRegion: true,
    requiresPostalCode: true,
  },
  {
    code: "CH",
    name: "Switzerland",
    regionLabel: "Canton",
    postalLabel: "Postal code",
    requiresRegion: false,
    requiresPostalCode: true,
  },
  {
    code: "CD",
    name: "Congo (DRC)",
    regionLabel: "Province",
    postalLabel: "Postal code",
    requiresRegion: false,
    // The DRC has no postal code system.
    requiresPostalCode: false,
  },
  {
    code: "AU",
    name: "Australia",
    regionLabel: "State",
    postalLabel: "Postcode",
    requiresRegion: true,
    requiresPostalCode: true,
  },
  {
    code: "JP",
    name: "Japan",
    regionLabel: "Prefecture",
    postalLabel: "Postal code",
    requiresRegion: true,
    requiresPostalCode: true,
  },
] as const satisfies readonly CheckoutCountry[];

export type CountryCode = (typeof countries)[number]["code"];

const countryCodes = countries.map((country) => country.code) as [
  CountryCode,
  ...CountryCode[],
];

export function getCountry(code: string | undefined): CheckoutCountry | undefined {
  return countries.find((country) => country.code === code);
}

/* -------------------------------------------------------------------------- */
/*                               Delivery methods                             */
/* -------------------------------------------------------------------------- */

/** Flat rate of the express option. Move it to `siteConfig` if you prefer. */
export const EXPRESS_SHIPPING_COST = siteConfig.expressShippingCost;

export type DeliveryMethod = "standard" | "express";

export const deliveryMethods: {
  value: DeliveryMethod;
  label: string;
  estimate: string;
}[] = [
  { value: "standard", label: "Standard", estimate: "3–5 business days" },
  { value: "express", label: "Express", estimate: "1–2 business days" },
];

/** Shipping cost of a delivery method for a given cart subtotal. */
export function getShippingCost(method: DeliveryMethod, subtotal: number) {
  if (method === "express") return EXPRESS_SHIPPING_COST;
  return subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingCost;
}

export function getItemsSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Totals of an order for the chosen delivery method: subtotal and tax come
 * from `getOrderTotals`, shipping from the delivery method.
 */
export function getCheckoutTotals(items: CartItem[], delivery: DeliveryMethod) {
  const { subtotal, tax } = getOrderTotals(getItemsSubtotal(items));
  const shipping = getShippingCost(delivery, subtotal);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

/* -------------------------------------------------------------------------- */
/*                                 Formatting                                 */
/* -------------------------------------------------------------------------- */

const onlyDigits = (value: string) => value.replace(/\D/g, "");

/** American Express numbers are 15 digits, grouped 4-6-5. */
const isAmex = (digits: string) => /^3[47]/.test(digits);

/** "4242424242424242" -> "4242 4242 4242 4242" (and 4-6-5 for Amex). */
export function formatCardNumber(value: string) {
  const digits = onlyDigits(value).slice(0, 19);

  if (isAmex(digits)) {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }

  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "0429" -> "04/29". Typing "4" becomes "04/" for faster input. */
export function formatExpiry(value: string, previous = "") {
  let digits = onlyDigits(value).slice(0, 4);
  // Deleting the slash also deletes the digit before it.
  if (previous.endsWith("/") && value.length < previous.length) {
    digits = digits.slice(0, 1);
  }
  if (digits.length === 1 && Number(digits) > 1) digits = `0${digits}`;
  if (digits.length < 2) return digits;
  if (digits.length === 2 && value.length > previous.length) return `${digits}/`;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`.replace(/\/$/, "");
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const required = (message: string) => z.string().trim().min(1, message);

const POSTAL_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/;

/** "Postal code" -> "postal code", but keeps acronyms such as "ZIP code". */
const lowerFirst = (label: string) => label.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());

const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/;

/** `true` for the current month or later. Malformed values are reported by the regex. */
function isFutureExpiry(value: string) {
  if (!EXPIRY_PATTERN.test(value)) return true;
  const [month, year] = value.split("/").map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  return year > currentYear || (year === currentYear && month >= now.getMonth() + 1);
}

export const checkoutSchema = z
  .object({
    // Contact
    email: z.string().trim().pipe(z.email("Enter a valid email address")),
    newsletter: z.boolean(),

    // Shipping address
    firstName: required("Enter your first name"),
    lastName: required("Enter your last name"),
    address: required("Enter your street address"),
    apartment: z.string().trim(),
    city: required("Enter your city"),
    country: z.enum(countryCodes, { error: "Select a country" }),
    // Region and postal code depend on the country (see superRefine below).
    region: z.string().trim(),
    postalCode: z.string().trim(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s().-]{7,20}$/, "Enter a valid phone number"),

    // Delivery
    delivery: z.enum(["standard", "express"]),

    // Payment (demo)
    cardNumber: z
      .string()
      .refine((value) => /^\d{13,19}$/.test(onlyDigits(value)), "Enter a valid card number"),
    cardExpiry: z
      .string()
      .regex(EXPIRY_PATTERN, "Enter a valid expiration date (MM/YY)")
      .refine(isFutureExpiry, "This card has expired"),
    cardCvc: z.string().regex(/^\d{3,4}$/, "Enter the 3 or 4 digit security code"),
    cardName: required("Enter the name shown on the card"),

    // Billing address (only validated when different from shipping)
    billingSameAsShipping: z.boolean(),
    billingAddress: z.string().trim(),
    billingCity: z.string().trim(),
    billingPostalCode: z.string().trim(),
    billingCountry: z.union([z.enum(countryCodes), z.literal("")]),
  })
  .superRefine((values, ctx) => {
    const invalid = (path: keyof typeof values, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    const country = getCountry(values.country);
    if (country?.requiresRegion && !values.region) {
      invalid("region", `Enter your ${lowerFirst(country.regionLabel)}`);
    }
    if (country?.requiresPostalCode !== false && !POSTAL_CODE_PATTERN.test(values.postalCode)) {
      invalid("postalCode", `Enter a valid ${lowerFirst(country?.postalLabel ?? "Postal code")}`);
    }

    // The billing address is only validated when it differs from shipping.
    if (values.billingSameAsShipping) return;

    const billingCountry = getCountry(values.billingCountry);
    if (!values.billingAddress) invalid("billingAddress", "Enter the billing address");
    if (!values.billingCity) invalid("billingCity", "Enter the billing city");
    if (
      billingCountry?.requiresPostalCode !== false &&
      !POSTAL_CODE_PATTERN.test(values.billingPostalCode)
    ) {
      invalid("billingPostalCode", "Enter a valid postal code");
    }
    if (!billingCountry) invalid("billingCountry", "Select a country");
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutFormValues = {
  email: "",
  newsletter: false,
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  country: "US",
  region: "",
  postalCode: "",
  phone: "",
  delivery: "standard",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
  billingSameAsShipping: true,
  billingAddress: "",
  billingCity: "",
  billingPostalCode: "",
  billingCountry: "",
};
