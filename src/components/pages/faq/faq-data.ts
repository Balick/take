import { countries, deliveryMethods } from "@/components/checkout/checkout-schema";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export interface FaqItem {
  /** Stable id, used as the accordion item value. */
  id: string;
  question: string;
  /** Plain-text paragraphs, also used for the FAQPage structured data. */
  answer: string[];
  link?: { href: string; label: string };
}

export interface FaqSection {
  /** Anchor of the section, linked from the footer and product pages (`/faq#returns`). */
  id: "orders" | "shipping" | "returns" | "payment" | "products";
  title: string;
  description: string;
  items: FaqItem[];
}

const freeShipping = formatPrice(siteConfig.freeShippingThreshold);
const standardRate = formatPrice(siteConfig.shippingCost);
const expressRate = formatPrice(siteConfig.expressShippingCost);
const estimate = (method: "standard" | "express") =>
  deliveryMethods.find((option) => option.value === method)?.estimate ?? "";
const listFormat = new Intl.ListFormat(siteConfig.locale, { type: "conjunction" });
const destinations = listFormat.format(countries.map((country) => country.name));
const paymentMethods = listFormat.format(siteConfig.paymentMethods);

export const faqSections: FaqSection[] = [
  {
    id: "orders",
    title: "Orders",
    description: "Placing, changing and tracking an order.",
    items: [
      {
        id: "place-order",
        question: "How do I place an order?",
        answer: [
          "Add the pieces you like to your bag, open it and select Checkout. You can check out as a guest or sign in to save your details for next time.",
          "Right after payment you’ll see your order number (it looks like ORD-7KQ2XM) and receive a confirmation email.",
        ],
      },
      {
        id: "change-order",
        question: "Can I change or cancel my order?",
        answer: [
          "We pack orders quickly, but we can update the shipping address, swap a size or color, or cancel the order if you reach us within one hour of ordering.",
          "After that, your order is on its way: simply return what you don’t want once it arrives.",
        ],
        link: { href: "/contact", label: "Contact customer care" },
      },
      {
        id: "track-order",
        question: "How do I track my order?",
        answer: [
          "As soon as your parcel leaves our studio, we email you a tracking link. If you have an account, every order and its delivery status is also listed there.",
        ],
        link: { href: "/account", label: "Go to my account" },
      },
      {
        id: "missing-order",
        question: "My order hasn’t arrived. What should I do?",
        answer: [
          "First check the tracking link and your mailbox or building reception: carriers sometimes leave parcels with a neighbor. If it’s been more than two business days past the estimated date, get in touch and we’ll open an investigation with the carrier or send a replacement.",
        ],
        link: { href: "/contact", label: "Report a missing parcel" },
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    description: "Delivery rates, times and destinations.",
    items: [
      {
        id: "shipping-cost",
        question: "How much does shipping cost?",
        answer: [
          `Standard shipping is free on every order of ${freeShipping} or more. Below that, it’s a flat ${standardRate}.`,
          `Express delivery is ${expressRate}, whatever the size of your order.`,
        ],
      },
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer: [
          `Orders placed before 2 pm ET ship the same business day. Standard delivery takes ${estimate("standard")}, express delivery ${estimate("express")}.`,
          "Delivery times can be slightly longer during the seasonal sale and the holidays.",
        ],
      },
      {
        id: "international",
        question: "Do you ship internationally?",
        answer: [
          `Yes. We currently ship to ${destinations}.`,
          "International orders may be subject to import duties and taxes, which are set by the destination country and paid on delivery.",
        ],
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    description: `Free returns within ${siteConfig.returnWindowDays} days.`,
    items: [
      {
        id: "return-policy",
        question: "What is your return policy?",
        answer: [
          `You have ${siteConfig.returnWindowDays} days from delivery to return any unworn, unwashed item with its original tags. Returns are free and refunded in full to your original payment method.`,
        ],
      },
      {
        id: "start-return",
        question: "How do I start a return?",
        answer: [
          `Send us your order number and the items you’d like to return, and we’ll email you a prepaid label. ${siteConfig.contact.responseTime} Then pack the items, attach the label and drop the parcel at any carrier location.`,
        ],
        link: { href: "/contact", label: "Request a return label" },
      },
      {
        id: "exchange",
        question: "Can I exchange an item for another size?",
        answer: [
          "Of course. Let us know the size or color you’d like and we’ll reserve it as soon as your return is scanned by the carrier, so you don’t miss out if stock is low.",
        ],
      },
      {
        id: "refund-time",
        question: "When will I get my refund?",
        answer: [
          "We process refunds within 3 business days of receiving your return. Depending on your bank, it can take another 5 to 10 business days to appear on your statement.",
        ],
      },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    description: "Accepted methods, security and taxes.",
    items: [
      {
        id: "payment-methods",
        question: "Which payment methods do you accept?",
        answer: [
          `We accept ${paymentMethods}. Your card is only charged once your order is confirmed.`,
        ],
      },
      {
        id: "payment-security",
        question: "Is my payment information secure?",
        answer: [
          "Yes. Payments are encrypted end to end and processed by a certified payment provider. We never see or store your full card number.",
        ],
      },
      {
        id: "taxes",
        question: "Are taxes included in the price?",
        answer: [
          "Prices are shown before tax. Applicable tax is calculated at checkout and shown in your order summary before you pay.",
        ],
      },
      {
        id: "discount-codes",
        question: "Can I use a discount code?",
        answer: [
          "Yes, enter it in the promo code field of your bag summary before checking out. Only one code can be used per order.",
        ],
      },
    ],
  },
  {
    id: "products",
    title: "Products & sizing",
    description: "Fit, materials and care.",
    items: [
      {
        id: "sizing",
        question: "How do your pieces fit?",
        answer: [
          "Our tees and long sleeves have a relaxed, true-to-size fit. If you’re between sizes, take the smaller one for a classic fit or the larger one for a looser look. Every product page has a size guide with exact measurements.",
        ],
        link: { href: "/products", label: "Browse the collection" },
      },
      {
        id: "materials",
        question: "What are your products made of?",
        answer: [
          "Our tees and long sleeves are made of 100% cotton, from soft combed jersey to dense 240 gsm organic cotton, chosen to soften with every wash without losing their shape. Bottles are 18/8 stainless steel. Each product page lists the full composition.",
        ],
      },
      {
        id: "care",
        question: "How should I care for my garments?",
        answer: [
          "Wash cold, inside out, with similar colors, and lay flat or hang to dry. Skipping the tumble dryer keeps the fabric dense and the prints crisp for years.",
        ],
      },
      {
        id: "restock",
        question: "Will a sold-out item come back?",
        answer: [
          "Most of our essentials are restocked every few weeks. Save the item to your wishlist and check back, or contact us and we’ll tell you when the next batch is expected.",
        ],
        link: { href: "/wishlist", label: "View my wishlist" },
      },
    ],
  },
];
