import { Skeleton } from "@/components/ui/skeleton";

export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Main product image */}
      <Skeleton className="aspect-square w-full rounded-lg" />

      {/* Thumbnail gallery */}
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-20 shrink-0 rounded-md" />
        ))}
      </div>
    </div>
  );
}
