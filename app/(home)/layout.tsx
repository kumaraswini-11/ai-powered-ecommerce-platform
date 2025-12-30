import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AppShell } from "@/components/app/app-shell";
import { Header } from "@/components/app/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { SanityLive } from "@/sanity/lib/live";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartStoreProvider>
          <ChatStoreProvider>
            <NuqsAdapter>
              <AppShell>
                <Header />
                <main>{children}</main>
              </AppShell>

              <Toaster position="bottom-center" />

              {/* Sanity Live visual editing/real-time updates tool */}
              <SanityLive />
            </NuqsAdapter>
          </ChatStoreProvider>
        </CartStoreProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
