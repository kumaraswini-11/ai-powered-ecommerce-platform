import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartStoreProvider } from "@/lib/store/cart-store-provider";
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
          <NuqsAdapter>
            <Header />
            <main>{children}</main>
            <Toaster position="bottom-center" />

            {/* Sanity Live visual editing/real-time updates tool */}
            <SanityLive />
          </NuqsAdapter>
        </CartStoreProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
