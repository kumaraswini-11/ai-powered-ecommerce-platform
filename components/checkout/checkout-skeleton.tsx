import { Skeleton } from "@/components/ui/skeleton";

// Reusable skeleton line
const SkeletonLine = ({
  width,
  height = 4,
  className = "",
}: {
  width: string | number;
  height?: number;
  className?: string;
}) => <Skeleton className={`h-${height} w-${width} ${className}`} />;

// Skeleton for individual cart item
const CartItemSkeleton = () => (
  <div className="flex gap-4 px-6 py-4">
    <Skeleton className="h-20 w-20 shrink-0 rounded-md" />
    <div className="flex flex-1 flex-col justify-between">
      <div className="space-y-2">
        <SkeletonLine width="40" height={5} />
        <SkeletonLine width="16" />
      </div>
    </div>
    <div className="space-y-2 text-right">
      <SkeletonLine width="16" height={5} />
      <SkeletonLine width="20" />
    </div>
  </div>
);

// Skeleton for cart items list
const CartItemsSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
    <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <SkeletonLine width="40" height={5} />
    </div>
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Skeleton for order summary
const OrderSummarySkeleton = () => (
  <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
    <SkeletonLine width="36" height={5} />

    <div className="mt-6 space-y-4">
      <div className="flex justify-between">
        <SkeletonLine width="16" />
        <SkeletonLine width="16" />
      </div>
      <div className="flex justify-between">
        <SkeletonLine width="16" />
        <SkeletonLine width="36" />
      </div>
      <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <div className="flex justify-between">
          <SkeletonLine width="12" height={5} />
          <SkeletonLine width="20" height={5} />
        </div>
      </div>
    </div>

    <Skeleton className="mt-6 h-12 w-full" />
    <Skeleton className="mx-auto mt-4 h-3 w-56" />
  </div>
);

// Main checkout skeleton
export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <SkeletonLine width="36" />
        <SkeletonLine width="32" height={9} className="mt-4" />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <CartItemsSkeleton />
        </div>

        {/* Order Total & Checkout */}
        <div className="lg:col-span-2">
          <OrderSummarySkeleton />
        </div>
      </div>
    </div>
  );
}
