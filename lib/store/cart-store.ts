import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export type CartStore = CartState & CartActions;

// Default state
export const defaultInitState: CartState = {
  items: [],
  isOpen: false,
};

/**
 * We use a factory function so each request/user gets a unique store instance.
 * Persist middleware is used with 'skipHydration' to avoid mismatch between Server and Client (for Next.js SSR compatibility).
 * @see https://zustand.docs.pmnd.rs/guides/nextjs#hydration-and-asynchronous-storages
 */
export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    persist(
      (set) => ({
        ...initState,

        /**
         * addItem: Adds a product to the cart or increases its quantity.
         * - Avoids direct mutation of state.
         * - Uses functional updates for predictable state transitions.
         */
        addItem: (item, quantity = 1) =>
          set((state) => {
            const existing = state.items.find((i) => i.productId === item.productId);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                ),
              };
            }
            return { items: [...state.items, { ...item, quantity }] };
          }),

        // removeItem: Filters out the product from items.
        removeItem: (productId) =>
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          })),

          // updateQuantity: Updates count or removes item if quantity <= 0.
        updateQuantity: (productId, quantity) =>
          set((state) => {
            if (quantity <= 0) {
              return { items: state.items.filter((i) => i.productId !== productId) };
            }
            return {
              items: state.items.map((i) =>
                i.productId === productId ? { ...i, quantity } : i
              ),
            };
          }),

        clearCart: () => set({ items: [] }),
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
      }),
      {
        name: "cart-storage",
        skipHydration: true, // Skip automatic hydration - i'll trigger it manually on the client
        partialize: (state) => ({ items: state.items }), // Only persist items, not UI state like isOpen
      }
    )
  );
};