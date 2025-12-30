"use client";

import { Badge } from "@/components/ui/badge";
import { isLowStock as checkLowStock } from "@/lib/constants/stock";
import { useCartItem } from "@/lib/store/cart-store-provider";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  productId: string;
  stock: number;
  className?: string;
}

/**
 * - Displays badge for low stock or maximum quantity in cart
 * - Renders nothing if stock is sufficient
 */
export function StockBadge({ productId, stock, className }: StockBadgeProps) {
  const cartItem = useCartItem(productId);
  const quantityInCart = cartItem?.quantity ?? 0;

  const isAtMax = quantityInCart >= stock && stock > 0;
  const lowStock = checkLowStock(stock);

  // Max quantity in cart badge
  if (isAtMax) {
    return (
      <Badge
        variant="secondary"
        className={cn("w-fit bg-blue-100 text-blue-800", className)}
        aria-label="Maximum quantity reached in cart"
      >
        Max in cart
      </Badge>
    );
  }

  // Low stock badge
  if (lowStock) {
    return (
      <Badge
        variant="secondary"
        className={cn("w-fit bg-amber-100 text-amber-800", className)}
        aria-label={`Only ${stock} left in stock`}
      >
        Only {stock} left in stock
      </Badge>
    );
  }

  // Default: no badge
  return null;
}
