import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedProducts } from "@/lib/queries";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) return null;

  return (
    <section className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow="Best sellers"
        title="Featured pieces"
        description="The styles our customers come back for, year after year."
        link={{ href: "/products", label: "View all" }}
      />
      <ProductGrid products={products} className="lg:grid-cols-4" />
    </section>
  );
}
