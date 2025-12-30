import { createStore } from "zustand/vanilla";

export interface ChatState {
  isOpen: boolean;
  pendingMessage: string | null;
}

export interface ChatActions {
  openChat: () => void;
  openChatWithMessage: (message: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  clearPendingMessage: () => void;
}

export type ChatStore = ChatState & ChatActions;

/**
 * Default initial state for the chat store
 * Chat is closed by default and has no pending message
 */
export const defaultInitState: ChatState = {
  isOpen: false,
  pendingMessage: null,
};

/**
 * Chat store factory:
 *
 * - Creates a new store instance per provider/request
 * - Uses vanilla Zustand store for compatibility with React Context
 * - No persistence is used:
 *   - Chat UI should always start closed on page load
 *   - pendingMessage is transient UI state
 *
 * This mirrors the same architectural pattern used in cart-store.ts
 */
export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,

    // Opens the chat UI
    openChat: () => set({ isOpen: true }),

    // Opens the chat UI with a predefined message
    // Useful for contextual actions (e.g. "Ask about this product")
    openChatWithMessage: (message: string) =>
      set({ isOpen: true, pendingMessage: message }),

    // Closes the chat UI
    closeChat: () => set({ isOpen: false }),

    // Toggles chat open/close state
    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

    // Clears the pending message after it has been consumed
    clearPendingMessage: () => set({ pendingMessage: null }),
  }));
};
