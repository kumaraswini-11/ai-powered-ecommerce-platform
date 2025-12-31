"use client";

import { Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useCartItems } from "@/lib/store/cart-store-provider";

interface CheckoutButtonProps {
  disabled?: boolean;
}

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  const router = useRouter();
  const items = useCartItems();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await createCheckoutSession(items);

        if (result?.success && result?.url) {
          router.push(result.url); // Redirect to Stripe Checkout
        } else {
          const message = result?.error ?? "Checkout failed";
          setError(message);
          toast.error("Checkout Error", { description: message });
        }
      } catch (err) {
        setError("Unexpected error occurred");
        toast.error("Checkout Error", {
          description: "Unexpected error occurred",
        });
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={disabled || isPending || items.length === 0}
        size="lg"
        className="w-full"
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 size-5" />
            Pay with Stripe
          </>
        )}
      </Button>

      {error && (
        <p
          aria-live="polite"
          className="text-center text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
