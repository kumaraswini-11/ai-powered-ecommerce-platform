import { Suspense } from "react";

import { CategoryTiles } from "@/components/category-tiles";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { FeaturedCarouselSkeleton } from "@/components/featured-carousel-skeleton";
import { ProductSection } from "@/components/product-section";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from "@/sanity/queries/products";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

/**
 * Helper to determine which GROQ query to use based on sort params
 */
function getProductQuery(sort: string, searchQuery: string) {
  if (searchQuery && sort === "relevance")
    return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;

  const queryMap: Record<string, string> = {
    price_asc: FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
    price_desc: FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
    relevance: FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  };

  return queryMap[sort] || FILTER_PRODUCTS_BY_NAME_QUERY;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Normalize parameters
  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const sort = params.sort ?? "name";

  // 1. Parallel Fetching: Executes all requests at once instead of one-by-one
  const [categoriesReq, productsReq, featuredReq] = await Promise.all([
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
    sanityFetch({
      query: getProductQuery(sort, searchQuery),
      params: {
        searchQuery,
        categorySlug,
        color: params.color ?? "",
        material: params.material ?? "",
        minPrice: Number(params.minPrice) || 0,
        maxPrice: Number(params.maxPrice) || 0,
        inStock: params.inStock === "true",
      },
    }),
    sanityFetch({ query: FEATURED_PRODUCTS_QUERY }),
  ]);

  const categories = categoriesReq.data;
  const products = productsReq.data;
  const featuredProducts = featuredReq.data;

  // 2. Find the actual category title for the heading
  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const displayTitle = activeCategory?.title || "All Products";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeaturedCarousel products={featuredProducts} />
        </Suspense>
      )}

      {/* Page Banner */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Shop {displayTitle}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Premium furniture for your home
          </p>
        </div>

        {/* Category Tiles - Full width */}
        <div className="mt-6">
          <CategoryTiles
            categories={categories}
            activeCategory={categorySlug}
          />
        </div>
      </div>

      {/* Product Listing Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductSection
          categories={categories}
          products={products}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
