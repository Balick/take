export type CategorySlug =
  | "accessories"
  | "dresses"
  | "t-shirts"
  | "long-sleeves"
  | "drinkware";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface ProductColor {
  name: string;
  /** Any valid CSS color, used for the swatch. */
  value: string;
}

export type ProductBadge = "new" | "bestseller" | "limited";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** One-line pitch used on cards and in search results. */
  tagline: string;
  description: string;
  category: CategorySlug;
  /** Price in the store currency (see `siteConfig.currency`). */
  price: number;
  /** Original price, displayed struck-through when the product is on sale. */
  compareAtPrice?: number;
  images: string[];
  colors: ProductColor[];
  /** Empty when the product has no size (e.g. a bottle). */
  sizes: string[];
  details: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badges: ProductBadge[];
  featured: boolean;
  /** ISO date, used to sort by "newest". */
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date */
  date: string;
  verified: boolean;
}

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export interface ProductFilters {
  category?: CategorySlug;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
  sort?: SortOption;
}

export interface CartItem {
  /** Unique per product + variant combination. */
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color?: string;
  size?: string;
  quantity: number;
  /** Units available for the product, shared by all of its variants. */
  stock: number;
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
}
