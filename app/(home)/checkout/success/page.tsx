import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SuccessClient } from "@/components/checkout/success-client";
import { getCheckoutSession } from "@/lib/actions/checkout";

export const metadata: Metadata = {
  title: "Order Confirmed | Furniture Shop",
  description: "Your order has been placed successfully",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Guard: missing session ID
  if (!sessionId) {
    redirect("/");
  }

  const result = await getCheckoutSession(sessionId);

  // Guard: invalid or failed session fetch
  if (!result.success || !result.session) {
    redirect("/");
  }

  return <SuccessClient session={result.session} />;
}
