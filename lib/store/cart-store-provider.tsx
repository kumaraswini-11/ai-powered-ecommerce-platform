"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useStore } from "zustand";

import {
  createCartStore,
  type CartStore,
  type CartState,
  defaultInitState,
} from "./cart-store";

/**
 * Store API type - This is the full Zustand store instance (getState, setState, subscribe, etc.)
 */
export type CartStoreApi = ReturnType<typeof createCartStore>;

/**
 * Zustand store context
 * We intentionally store the *store instance*, not state,
 * so components can subscribe via selectors.
 *
 * Official pattern:
 * https://zustand.docs.pmnd.rs/guides/nextjs
 */
const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

interface CartStoreProviderProps {
  children: ReactNode;

  /**
   * Optional initial state (e.g. from server, cookies, or tests)
   * If not provided, falls back to defaultInitState
   */
  initialState?: CartState;
}

/**
 * CartStoreProvider
 *
 * - Creates exactly ONE store instance per provider
 * - Safe for Next.js App Router
 * - Prevents store recreation on re-renders (i.e. Manually triggers rehydration from localStorage on the client)
 *
 * NOTE:
 * We do NOT create the store at module scope.
 * This avoids leaking state between users/requests.
 */
export const CartStoreProvider = ({
  children,
  initialState,
}: CartStoreProviderProps) => {
  // Use useState with lazy initialization instead of useRef
  // This creates the store only once but doesn't violate React's ref access rules
  const [store] = useState(() =>
    createCartStore(initialState ?? defaultInitState),
  );

  /**
   * Manually trigger persist rehydration on the client, why?
   *
   * - localStorage is not available during SSR
   * - Prevents hydration mismatch between server & client after mount
   *
   * Official reference:
   * https://zustand.docs.pmnd.rs/guides/nextjs#hydration-and-asynchronous-storages
   */
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);

  return (
    <CartStoreContext.Provider value={store}>
      {children}
    </CartStoreContext.Provider>
  );
};

/**
 * useCartStore - Base hook to access the cart store with a selector.
 *
 * Rules:
 * - Must be used inside CartStoreProvider
 * - Always use selectors to minimize re-renders
 * - Handles SSR by returning default state until hydrated
 */
export const useCartStore = <T,>(selector: (state: CartStore) => T): T => {
  const store = useContext(CartStoreContext);

  if (!store) {
    throw new Error("useCartStore must be used within CartStoreProvider");
  }

  return useStore(store, selector);
};

// ============================================
// Derived State Hooks (Selectors)
// ============================================

// Get all cart items
export const useCartItems = () => useCartStore((state) => state.items);

// Get cart open/closed state
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

/**
 * Get total quantity of items in cart
 *
 * NOTE:
 * This recalculates on each relevant state change.
 * For very large carts, consider memoized selectors.
 */
export const useTotalItems = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

// Get total price of cart
export const useTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

// Find a single cart item by productId. Useful for product detail pages.
export const useCartItem = (productId: string) =>
  useCartStore((state) =>
    state.items.find((item) => item.productId === productId),
  );

// ============================================
// Action Hooks
// ============================================

/**
 * useCartActions:
 * Actions in Zustand are stable references, so it's safe to destructure them.
 * This keeps components clean and avoids accidental re-renders.
 */
export const useCartActions = () => {
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };
};
