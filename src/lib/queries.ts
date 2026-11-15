import { categories, products, reviews } from "@/lib/data/catalog";
import { isOnSale } from "@/lib/format";
import type {
  Category,
  CategorySlug,
  Product,
  ProductFilters,
  Review,
  SortOption,
} from "@/types";

/**
 * Data access layer.
 *
 * Every page reads the catalog through these async functions, so you can plug
 * in a real backend (REST, GraphQL, a database, Shopify...) by rewriting this
 * file only. Keep the signatures and the rest of the app keeps working.
 */

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function sortProducts(list: Product[], sort: SortOption = "featured") {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount,
      );
  }
}

/** Lowercase, hyphens as spaces, naive singular ("sleeves" -> "sleeve"). */
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word))
    .join(" ");
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const query = filters.query ? normalize(filters.query) : "";

  const result = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
    if (filters.onSale && !isOnSale(product)) return false;
    if (filters.inStock && product.stock === 0) return false;
    if (query) {
      const categoryName =
        categories.find((category) => category.slug === product.category)?.name ?? "";
      const haystack = normalize(
        [product.name, product.tagline, categoryName, product.category].join(" "),
      );
      if (!query.split(" ").every((word) => haystack.includes(word))) return false;
    }
    return true;
  });

  return sortProducts(result, filters.sort);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return sortProducts(products, "newest").slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const others = sortProducts(
    products.filter((p) => p.category !== product.category),
    "rating",
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Highest price in the catalog, used to bound the price filter. */
export const maxCatalogPrice = Math.ceil(
  Math.max(...products.map((product) => product.price)) / 10,
) * 10;
