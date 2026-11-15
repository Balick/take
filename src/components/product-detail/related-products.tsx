import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { getRelatedProducts } from "@/lib/queries";
import type { Category, Product } from "@/types";

export async function RelatedProducts({
  product,
  category,
}: {
  product: Product;
  category?: Pick<Category, "slug" | "name">;
}) {
  const related = await getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="border-t">
      <div className="container-page py-16 sm:py-24">
        <SectionHeading
          eyebrow="Complete the look"
          title={<span id="related-heading">You may also like</span>}
          link={
            category
              ? { href: `/products?category=${category.slug}`, label: `Shop ${category.name}` }
              : { href: "/products", label: "Shop all" }
          }
        />
        <ProductGrid products={related} />
      </div>
    </section>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <div className="border-t">
      <div className="container-page py-16 sm:py-24">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-64" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
