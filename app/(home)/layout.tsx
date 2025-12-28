import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <main>{children}</main>
      <Toaster position="bottom-center" />

      {/* Sanity Live visual editing/real-time updates tool */}
      <SanityLive />
    </ClerkProvider>
  );
}
