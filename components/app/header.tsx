"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Package, ShoppingBag, Sparkles, User } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";

export function Header() {
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();

  // These re-render only when their selected slice changes
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo Section */}
        <Logo />

        {/* Right: User & App Actions */}
        <div className="flex items-center gap-2">
          {/* Orders link - visible only for authenticated users */}
          <SignedIn>
            <Button asChild>
              <Link href="/orders" className="flex items-center gap-2">
                <Package className="size-5" />
                <span className="text-sm font-medium">My Orders</span>
              </Link>
            </Button>
          </SignedIn>

          {/* AI Shopping Assistant trigger. Hidden when the chat is already open */}
          {!isChatOpen && (
            <Button
              onClick={openChat}
              className="gap-2 bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200/50 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-300/50 dark:shadow-amber-900/30 dark:hover:shadow-amber-800/40"
            >
              <Sparkles className="size-4" />
              <span className="text-sm font-medium">Ask AI</span>
            </Button>
          )}

          {/* Cart trigger button. Displays item count badge when cart is not empty */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingBag className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
            <span className="sr-only">Open cart ({totalItems} items)</span>
          </Button>

          {/* Authenticated user menu with Clerk */}
          <SignedIn>
            <UserButton
              afterSwitchSessionUrl="/"
              appearance={{
                elements: {
                  avatarBox: "size-9",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Orders"
                  labelIcon={<Package className="size-4" />}
                  href="/orders"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>

          {/* Sign-in action for unauthenticated users */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon">
                <User className="size-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
