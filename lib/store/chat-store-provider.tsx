"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import {
  createChatStore,
  type ChatStore,
  type ChatState,
  defaultInitState,
} from "@/lib/store/chat-store";

// Store API type - This represents the full Zustand store instance
export type ChatStoreApi = ReturnType<typeof createChatStore>;

// Zustand store context - I store the *store instance*, not state, so components can subscribe via selectors.
const ChatStoreContext = createContext<ChatStoreApi | undefined>(undefined);

interface ChatStoreProviderProps {
  children: ReactNode;

  // Optional initial state (useful for tests or controlled initialization)
  initialState?: ChatState;
}

/**
 * ChatStoreProvider:
 *
 * - Creates exactly ONE store instance per provider
 * - Safe for Next.js App Router
 * - Prevents store recreation on re-renders
 *
 * NOTE:
 * We do NOT create the store at module scope.
 * This avoids leaking state between users/requests.
 */
export const ChatStoreProvider = ({
  children,
  initialState,
}: ChatStoreProviderProps) => {
  // Lazy initialization ensures the store is created only once per provider instance.
  const [store] = useState(() =>
    createChatStore(initialState ?? defaultInitState),
  );

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
};

/**
 * useChatStore:
 *
 * Base hook to access the chat store with a selector.
 *
 * Rules:
 * - Must be used inside ChatStoreProvider
 * - Always use selectors to minimize re-renders
 */
export const useChatStore = <T,>(selector: (state: ChatStore) => T): T => {
  const store = useContext(ChatStoreContext);

  if (!store) {
    throw new Error("useChatStore must be used within ChatStoreProvider");
  }

  return useStore(store, selector);
};

// ============================================
// Derived State Hooks (Selectors)
// ============================================

// Get chat open/closed state
export const useIsChatOpen = () => useChatStore((state) => state.isOpen);

// Get pending chat message
export const usePendingMessage = () =>
  useChatStore((state) => state.pendingMessage);

// useChatActions: Actions in Zustand are stable references, so it's safe to destructure them.
export const useChatActions = () => {
  const openChat = useChatStore((state) => state.openChat);
  const openChatWithMessage = useChatStore(
    (state) => state.openChatWithMessage,
  );
  const closeChat = useChatStore((state) => state.closeChat);
  const toggleChat = useChatStore((state) => state.toggleChat);
  const clearPendingMessage = useChatStore(
    (state) => state.clearPendingMessage,
  );

  return {
    openChat,
    openChatWithMessage,
    closeChat,
    toggleChat,
    clearPendingMessage,
  };
};
