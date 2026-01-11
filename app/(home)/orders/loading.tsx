import { OrderCardSkeleton } from "@/components/order/order-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading state for the Orders page
 * Displays skeleton placeholders while order data is being fetched
 */
export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-2 h-5 w-52" />
      </div>

      {/* Orders List */}
      <section aria-busy="true" aria-label="Loading orders">
        <OrderCardSkeleton count={4} />
      </section>
    </div>
  );
}
