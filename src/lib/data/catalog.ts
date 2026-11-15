import type { Category, Product, Review } from "@/types";

/**
 * Demo catalog.
 *
 * This file is the single source of truth for the store content. Replace it
 * with your own data, or swap the functions in `src/lib/queries.ts` for calls
 * to your CMS / commerce backend (Shopify, Medusa, Stripe, a database...).
 */

export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Heavyweight cotton tees with clean, considered graphics.",
    image: "/images/t-shirt1.webp",
  },
  {
    slug: "long-sleeves",
    name: "Long Sleeves",
    description: "Layer-ready long sleeves for cooler days and late nights.",
    image: "/images/t-shirt-l2.webp",
  },
  {
    slug: "dresses",
    name: "Dresses",
    description: "Effortless silhouettes in soft, stretch-ribbed fabrics.",
    image: "/images/dress.webp",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "The finishing touches: beanies, caps and everyday carry.",
    image: "/images/bonnet.webp",
  },
  {
    slug: "drinkware",
    name: "Drinkware",
    description: "Insulated bottles that keep up with your routine.",
    image: "/images/gourde1.webp",
  },
];

const black = { name: "Black", value: "#111111" };
const charcoal = { name: "Charcoal", value: "#3f3f46" };
const bone = { name: "Bone", value: "#e7e5e4" };
const apparelSizes = ["XS", "S", "M", "L", "XL"];

export const products: Product[] = [
  {
    id: "p_001",
    slug: "classic-knit-beanie",
    name: "Classic Knit Beanie",
    tagline: "Rib-knit beanie with a woven badge",
    description:
      "A cold-weather essential cut from a soft acrylic-wool blend. The deep cuff can be worn up or down and is finished with our signature woven badge.",
    category: "accessories",
    price: 32,
    compareAtPrice: 45,
    images: ["/images/bonnet.webp"],
    colors: [charcoal, black],
    sizes: [],
    details: [
      "70% acrylic, 30% wool",
      "Fold-over cuff",
      "Woven 705 badge",
      "One size fits most",
    ],
    rating: 4.8,
    reviewCount: 214,
    stock: 42,
    badges: ["bestseller"],
    featured: true,
    createdAt: "2026-09-12",
  },
  {
    id: "p_002",
    slug: "ribbed-midi-dress",
    name: "Ribbed Midi Dress",
    tagline: "Body-skimming midi with contrast straps",
    description:
      "A figure-flattering midi dress in a stretch rib knit. Thin contrast straps and a scoop neckline give it a sporty edge that dresses up just as easily.",
    category: "dresses",
    price: 69,
    compareAtPrice: 119,
    images: ["/images/dress.webp"],
    colors: [black],
    sizes: apparelSizes,
    details: [
      "95% cotton, 5% elastane",
      "Contrast piping",
      "Midi length",
      "Machine wash cold",
    ],
    rating: 4.6,
    reviewCount: 87,
    stock: 8,
    badges: ["limited"],
    featured: true,
    createdAt: "2026-10-28",
  },
  {
    id: "p_003",
    slug: "sport-cap-bottle",
    name: "Sport Cap Bottle",
    tagline: "Insulated steel bottle, 600 ml",
    description:
      "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12. The flip-up sport cap makes one-handed sipping easy on the move.",
    category: "drinkware",
    price: 29,
    images: ["/images/gourde2.webp"],
    colors: [black],
    sizes: [],
    details: [
      "18/8 stainless steel",
      "Double-wall vacuum insulation",
      "Leak-proof sport cap",
      "BPA free",
    ],
    rating: 4.7,
    reviewCount: 156,
    stock: 64,
    badges: [],
    featured: false,
    createdAt: "2026-06-03",
  },
  {
    id: "p_004",
    slug: "loop-cap-bottle",
    name: "Loop Cap Bottle",
    tagline: "Insulated steel bottle with carry loop",
    description:
      "Our everyday bottle with a flexible carry loop. Powder-coated for grip and finished with a laser-etched emblem that will never peel.",
    category: "drinkware",
    price: 22,
    images: ["/images/gourde1.webp"],
    colors: [black],
    sizes: [],
    details: [
      "18/8 stainless steel",
      "Powder-coated finish",
      "Flexible carry loop",
      "Hand wash recommended",
    ],
    rating: 4.5,
    reviewCount: 98,
    stock: 120,
    badges: [],
    featured: false,
    createdAt: "2026-05-18",
  },
  {
    id: "p_005",
    slug: "emblem-back-print-tee",
    name: "Emblem Back Print Tee",
    tagline: "Oversized back print on heavyweight cotton",
    description:
      "A boxy, heavyweight tee with a bold circular emblem printed across the back. Pre-shrunk and garment-dyed for a lived-in feel from day one.",
    category: "t-shirts",
    price: 26,
    compareAtPrice: 39,
    images: ["/images/t-shirt1.webp", "/images/t-shirt2.webp"],
    colors: [black, bone],
    sizes: apparelSizes,
    details: [
      "100% organic cotton, 240 gsm",
      "Relaxed fit",
      "Screen-printed graphics",
      "Pre-shrunk",
    ],
    rating: 4.9,
    reviewCount: 342,
    stock: 35,
    badges: ["bestseller"],
    featured: true,
    createdAt: "2026-08-21",
  },
  {
    id: "p_006",
    slug: "chest-logo-tee",
    name: "Chest Logo Tee",
    tagline: "Minimal chest emblem, everyday fit",
    description:
      "The tee you will reach for first. A clean chest emblem on soft combed cotton with a regular fit that works on its own or under a jacket.",
    category: "t-shirts",
    price: 19,
    images: ["/images/t-shirt2.webp", "/images/t-shirt1.webp"],
    colors: [black, bone],
    sizes: apparelSizes,
    details: [
      "100% combed cotton, 180 gsm",
      "Regular fit",
      "Ribbed crew neck",
      "Machine wash cold",
    ],
    rating: 4.4,
    reviewCount: 61,
    stock: 80,
    badges: [],
    featured: false,
    createdAt: "2026-04-09",
  },
  {
    id: "p_007",
    slug: "california-long-sleeve",
    name: "California Long Sleeve",
    tagline: "Upper-back print, relaxed fit",
    description:
      "A relaxed long sleeve with a crisp upper-back print. Ribbed cuffs keep sleeves in place whether pushed up or worn long.",
    category: "long-sleeves",
    price: 36,
    compareAtPrice: 48,
    images: ["/images/t-shirt-l1.webp", "/images/t-shirt-l3.webp"],
    colors: [black],
    sizes: apparelSizes,
    details: [
      "100% cotton, 220 gsm",
      "Relaxed fit",
      "Ribbed cuffs",
      "Screen-printed graphics",
    ],
    rating: 4.7,
    reviewCount: 128,
    stock: 22,
    badges: ["new"],
    featured: true,
    createdAt: "2026-11-02",
  },
  {
    id: "p_008",
    slug: "essential-long-sleeve",
    name: "Essential Long Sleeve",
    tagline: "Front logo, brushed-cotton comfort",
    description:
      "A brushed-cotton long sleeve with a small front logo. Soft on the inside, structured on the outside, and built to last season after season.",
    category: "long-sleeves",
    price: 34,
    images: ["/images/t-shirt-l2.webp"],
    colors: [black, charcoal],
    sizes: apparelSizes,
    details: [
      "100% brushed cotton",
      "Regular fit",
      "Twin-needle stitching",
      "Machine wash cold",
    ],
    rating: 4.6,
    reviewCount: 74,
    stock: 3,
    badges: ["new"],
    featured: false,
    createdAt: "2026-11-08",
  },
  {
    id: "p_009",
    slug: "low-print-long-sleeve",
    name: "Low Print Long Sleeve",
    tagline: "Lower-back print, washed black",
    description:
      "A washed-black long sleeve with a low-placed back print for a subtle, considered look. Garment-washed for softness and minimal shrinkage.",
    category: "long-sleeves",
    price: 38,
    images: ["/images/t-shirt-l3.webp", "/images/t-shirt-l1.webp"],
    colors: [black],
    sizes: apparelSizes,
    details: [
      "100% cotton, 220 gsm",
      "Garment washed",
      "Relaxed fit",
      "Screen-printed graphics",
    ],
    rating: 4.3,
    reviewCount: 39,
    stock: 0,
    badges: [],
    featured: false,
    createdAt: "2026-07-14",
  },
];

type ReviewTemplate = Omit<Review, "id" | "productId">;

const sharedReviews: ReviewTemplate[] = [
  {
    author: "Lucas M.",
    rating: 5,
    title: "Fast shipping, great finish",
    body: "Arrived two days after ordering and the packaging was lovely. The details are even better in person.",
    date: "2026-10-12",
    verified: true,
  },
  {
    author: "Noah B.",
    rating: 4,
    title: "Solid everyday piece",
    body: "Well made and goes with everything. Would happily buy another one as a gift.",
    date: "2026-09-02",
    verified: true,
  },
];

const apparelReviews: ReviewTemplate[] = [
  {
    author: "Amara K.",
    rating: 5,
    title: "Exactly what I was looking for",
    body: "Great quality and the fit is spot on. It has already been through a few washes and still looks brand new.",
    date: "2026-10-30",
    verified: true,
  },
  {
    author: "Sofia R.",
    rating: 4,
    title: "Love it, sizing runs slightly large",
    body: "Really happy with it overall. I would size down if you prefer a closer fit, otherwise it is perfect.",
    date: "2026-09-25",
    verified: false,
  },
];

const goodsReviews: ReviewTemplate[] = [
  {
    author: "Amara K.",
    rating: 5,
    title: "My new daily essential",
    body: "I use it every single day. It feels sturdy, looks great and still looks brand new after months of use.",
    date: "2026-10-30",
    verified: true,
  },
  {
    author: "Sofia R.",
    rating: 4,
    title: "Great quality, simple design",
    body: "Exactly as pictured. The finish is lovely; I only wish there were a few more colors to choose from.",
    date: "2026-09-25",
    verified: false,
  },
];

export const reviews: Review[] = products.flatMap((product) => {
  const specific = product.sizes.length > 0 ? apparelReviews : goodsReviews;
  return [...specific, ...sharedReviews].map((review, index) => ({
    ...review,
    id: `${product.id}_r${index + 1}`,
    productId: product.id,
  }));
});
