"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useChatActions } from "@/lib/store/chat-store-provider";

interface AskAISimilarButtonProps {
  productName: string; // Name of the current product used to seed the AI query
}

/**
 * Opens the AI shopping assistant with a pre-filled prompt
 * asking for similar products to the current one.
 */
export function AskAISimilarButton({ productName }: AskAISimilarButtonProps) {
  const { openChatWithMessage } = useChatActions();

  const handleClick = () => {
    openChatWithMessage(`Show me products similar to "${productName}"`);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-label="Ask AI for similar products"
      className="w-full gap-2 bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:from-amber-600 hover:to-orange-700 hover:shadow-xl dark:from-amber-600 dark:to-orange-700 dark:hover:from-amber-700 dark:hover:to-orange-800"
    >
      <Sparkles className="size-4" />
      Ask AI for similar products
    </Button>
  );
}
