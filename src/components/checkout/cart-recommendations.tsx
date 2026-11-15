import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedProducts } from "@/lib/queries";

function RecommendationsSection({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby="cart-recommendations" className="border-t">
      <div className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="Complete the look"
          title={<span id="cart-recommendations">You might also like</span>}
          description="Customer favorites that pair well with what’s in your bag."
          link={{ href: "/products", label: "Shop all" }}
        />
        {children}
      </div>
    </section>
  );
}

/**
 * "You might also like" row of the cart page (Server Component). The demo
 * catalog resolves during prerendering, so this ships in the static shell;
 * with a slow backend it streams in behind its <Suspense> fallback.
 */
export async function CartRecommendations() {
  const products = await getFeaturedProducts(4);
  if (products.length === 0) return null;

  return (
    <RecommendationsSection>
      <ProductGrid products={products} className="lg:grid-cols-4" />
    </RecommendationsSection>
  );
}

export function CartRecommendationsSkeleton() {
  return (
    <RecommendationsSection>
      <ProductGridSkeleton count={4} className="lg:grid-cols-4" />
    </RecommendationsSection>
  );
}
