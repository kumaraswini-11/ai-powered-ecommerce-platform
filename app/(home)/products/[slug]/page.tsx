import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/sanity/queries/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Server component responsible for rendering a single product page. Fetches product data by slug from Sanity CMS.
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  // Handle invalid or missing product
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product image gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product details */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
