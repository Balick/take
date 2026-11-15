import type { NavItem } from "@/types";

const locale = "en-US";
const currency = "USD";
const freeShippingThreshold = 100;
const returnWindowDays = 30;

const thresholdLabel = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(freeShippingThreshold);

/**
 * Global store configuration.
 *
 * Start customizing the template here: name, URLs, navigation, footer links,
 * currency, shipping and return rules are all read from this file.
 */
export const siteConfig = {
  name: "Seven Zero Five",
  shortName: "705",
  tagline: "Modern essentials",
  description:
    "A modern, open-source e-commerce template built with Next.js, Tailwind CSS and shadcn/ui.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/opengraph-image",

  currency,
  locale,
  /** Orders with a subtotal of at least this amount ship for free. */
  freeShippingThreshold,
  shippingCost: 8,
  expressShippingCost: 15,
  /** Number of days customers have to return an item. */
  returnWindowDays,
  /** Flat tax rate applied at checkout (demo only). */
  taxRate: 0.08,

  /** Payment methods advertised in the cart, footer and FAQ. */
  paymentMethods: ["Visa", "Mastercard", "American Express"],

  announcement: `Free shipping on orders of ${thresholdLabel} or more · ${returnWindowDays}-day free returns`,

  /** Customer service details shown on the contact page (demo values). */
  contact: {
    email: "support@example.com",
    phone: { display: "+1 (555) 010-7050", href: "tel:+15550107050" },
    hours: [
      { days: "Monday to Friday", time: "9am – 6pm ET" },
      { days: "Saturday", time: "10am – 4pm ET" },
    ],
    address: {
      lines: ["705 Mercer Street", "New York, NY 10012", "United States"],
      note: "Studio visits by appointment only.",
    },
    responseTime: "We reply within one business day.",
  },

  links: {
    github: "https://github.com/Balick/tailus-ui-react-store",
    instagram: "https://instagram.com",
    x: "https://x.com",
  },

  mainNav: [
    { title: "New Arrivals", href: "/products?sort=newest" },
    { title: "Shop All", href: "/products" },
    { title: "Sale", href: "/products?sale=1" },
    { title: "About", href: "/about" },
  ] satisfies NavItem[],

  footerNav: [
    {
      title: "Shop",
      items: [
        { title: "All products", href: "/products" },
        { title: "New arrivals", href: "/products?sort=newest" },
        { title: "Best sellers", href: "/products?sort=rating" },
        { title: "Sale", href: "/products?sale=1" },
      ],
    },
    {
      title: "Help",
      items: [
        { title: "FAQ", href: "/faq" },
        { title: "Shipping & returns", href: "/faq#shipping" },
        { title: "Contact us", href: "/contact" },
        { title: "Track my order", href: "/account" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About", href: "/about" },
        { title: "Wishlist", href: "/wishlist" },
        { title: "My account", href: "/account" },
      ],
    },
  ] satisfies { title: string; items: NavItem[] }[],
};

export type SiteConfig = typeof siteConfig;
