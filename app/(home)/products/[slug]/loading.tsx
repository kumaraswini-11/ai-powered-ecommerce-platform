import { ProductGallerySkeleton } from "@/components/product/product-gallery-skeleton";
import { ProductInfoSkeleton } from "@/components/product/product-info-skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <ProductGallerySkeleton />

          {/* Product Information Skeleton */}
          <ProductInfoSkeleton />
        </div>
      </div>
    </div>
  );
}
