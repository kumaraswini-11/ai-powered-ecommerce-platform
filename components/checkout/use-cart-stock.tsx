"use client";

import { useEffect, useState } from "react";

import type { CartItem } from "@/lib/store/cart-store";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";

export interface StockInfo {
  productId: string;
  currentStock: number;
  isOutOfStock: boolean;
  exceedsStock: boolean;
  availableQuantity: number;
}

export type StockMap = Map<string, StockInfo>;

interface UseCartStockReturn {
  stockMap: StockMap;
  isLoading: boolean;
  hasStockIssues: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetches current stock levels for cart items
 * Returns stock info map and loading state
 */
export function useCartStock(items: CartItem[]): UseCartStockReturn {
  const [stockMap, setStockMap] = useState<StockMap>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  // 1. Create a stable string of IDs to act as a "trigger" variable.
  const productIdsKey = items.map((i) => i.productId).join(",");

  // 2. I define the fetch logic inside the effect or as a stable function.
  // To keep it clean and accessible via 'refetch', i use a standard function
  // but we will tell ESLint it's okay, or move the logic inside the effect.

  async function syncStock() {
    if (items.length === 0) {
      setStockMap(new Map());
      return;
    }

    setIsLoading(true);
    try {
      const ids = productIdsKey.split(",");
      const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, { ids });

      const newStockMap = new Map<string, StockInfo>();

      items.forEach((item) => {
        const product = products.find(
          (p: { _id: string }) => p._id === item.productId,
        );
        const currentStock = product?.stock ?? 0;

        newStockMap.set(item.productId, {
          productId: item.productId,
          currentStock,
          isOutOfStock: currentStock <= 0,
          exceedsStock: item.quantity > currentStock,
          availableQuantity: Math.max(0, Math.min(item.quantity, currentStock)),
        });
      });

      setStockMap(newStockMap);
    } catch (error) {
      console.error("Stock Sync Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Effect for automatic syncing
  useEffect(() => {
    syncStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdsKey]);
  /** * Note: I suppress 'syncStock' dependency because the function is recreated
   * on every render, but we only want to trigger it when the actual IDs change.
   * The React Compiler ensures this won't cause infinite loops.
   */

  // Derived state (No Hook needed, Compiler handles this)
  const hasStockIssues = Array.from(stockMap.values()).some(
    (info) => info.isOutOfStock || info.exceedsStock,
  );

  return {
    stockMap,
    isLoading,
    hasStockIssues,
    refetch: syncStock,
  };
}
