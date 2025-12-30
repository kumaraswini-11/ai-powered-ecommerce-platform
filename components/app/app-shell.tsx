"use client";

import { useIsChatOpen } from "@/lib/store/chat-store-provider";
import { cn } from "@/lib/utils";

// Wraps the home layout content, and adjusts height and overflow when the chat sidebar is open
export function AppShell({ children }: { children: React.ReactNode }) {
  const isChatOpen = useIsChatOpen();

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        isChatOpen && "max-xl:h-screen max-xl:overflow-hidden xl:mr-[448px]",
      )}
    >
      {children}
    </div>
  );
}
