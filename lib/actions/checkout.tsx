"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { getOrCreateStripeCustomer } from "@/lib/actions/customer";
import type { CartItem } from "@/lib/store/cart-store";
import { Stripe, stripe } from "@/lib/stripe";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 1. Fail-Fast Validation: Immediate exits for auth and empty carts.
 * 2. Precision Math: Used Math.round to avoid floating point pence/cent issues.
 * 3. Atomic Metadata: Structured metadata for easy parsing in webhooks.
 * 4. UX: Detailed stock feedback for the user.
 */
export async function createCheckoutSession(
  items: CartItem[],
): Promise<CheckoutResult> {
  try {
    // 1. Auth & Initial Guard Rails
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user)
      return { success: false, error: "Please sign in to checkout" };

    // Validate cart is not empty
    if (!items?.length) return { success: false, error: "Your cart is empty" };

    // 2. Data Synchronization (Sanity is the Source of Truth)
    const productIds = items.map((item) => item.productId);
    const sanityProducts = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    // 3. Validate each item
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const validationErrors: string[] = [];

    for (const item of items) {
      const product = sanityProducts.find(
        (p: { _id: string }) => p._id === item.productId,
      );

      if (!product) {
        validationErrors.push(`Product "${item.name}" is no longer available`);
        continue;
      }

      const currentStock = product.stock ?? 0;
      if (currentStock <= 0) {
        validationErrors.push(`"${product.name}" is out of stock`);
      } else if (item.quantity > currentStock) {
        validationErrors.push(
          `Only ${currentStock} of "${product.name}" remaining`,
        );
      } else {
        // Build Stripe Line Item only if validation passes
        lineItems.push({
          price_data: {
            currency: "gbp",
            product_data: {
              name: product.name ?? "",
              images: product.image?.asset?.url
                ? [product.image.asset.url]
                : [],
              metadata: { productId: product._id },
            },
            unit_amount: Math.round((product.price ?? 0) * 100),
          },
          quantity: item.quantity,
        });
      }
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 4. Customer Sync
    const email = user.emailAddresses[0]?.emailAddress ?? "";
    const name =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || email;
    const { stripeCustomerId, sanityCustomerId } =
      await getOrCreateStripeCustomer(email, name, userId);

    // 5. URL Construction (Reliable Environment Handling)
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${process.env.VERCEL_URL}` ||
      "http://localhost:3000";

    // 6. Stripe Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      allow_promotion_codes: true, // Scalability: Allow discounts
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "GB", // United Kingdom
          "US", // United States
          "CA", // Canada
          "AU", // Australia
          "NZ", // New Zealand
          "IE", // Ireland
          "DE", // Germany
          "FR", // France
          "ES", // Spain
          "IT", // Italy
          "NL", // Netherlands
          "BE", // Belgium
          "AT", // Austria
          "CH", // Switzerland
          "SE", // Sweden
          "NO", // Norway
          "DK", // Denmark
          "FI", // Finland
          "PT", // Portugal
          "PL", // Poland
          "CZ", // Czech Republic
          "GR", // Greece
          "HU", // Hungary
          "RO", // Romania
          "BG", // Bulgaria
          "HR", // Croatia
          "SI", // Slovenia
          "SK", // Slovakia
          "LT", // Lithuania
          "LV", // Latvia
          "EE", // Estonia
          "LU", // Luxembourg
          "MT", // Malta
          "CY", // Cyprus
          "JP", // Japan
          "SG", // Singapore
          "HK", // Hong Kong
          "KR", // South Korea
          "TW", // Taiwan
          "MY", // Malaysia
          "TH", // Thailand
          "IN", // India
          "AE", // United Arab Emirates
          "SA", // Saudi Arabia
          "IL", // Israel
          "ZA", // South Africa
          "BR", // Brazil
          "MX", // Mexico
          "AR", // Argentina
          "CL", // Chile
          "CO", // Colombia
        ],
      },
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        clerkUserId: userId,
        sanityCustomerId,
        // Using stringified JSON for complex metadata is easier to parse in webhooks
        orderData: JSON.stringify(
          items.map((i) => ({ id: i.productId, q: i.quantity })),
        ),
      },
    });

    return { success: true, url: session.url ?? undefined };
  } catch (err) {
    console.error("Checkout process failed:", err);
    return { success: false, error: "Payment gateway initialization failed" };
  }
}

/**
 * Retrieves a checkout session with expansion
 */
export async function getCheckoutSession(sessionId: string) {
  if (!sessionId) return { success: false, error: "Invalid Session ID" };

  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Not authenticated" };

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details", "payment_intent"],
    });

    if (session.metadata?.clerkUserId !== userId) {
      return { success: false, error: "Order access denied" };
    }

    return {
      success: true,
      session: {
        id: session.id,
        status: session.payment_status,
        customer: session.customer_details,
        amount: session.amount_total,
        items: session.line_items?.data,
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Order details currently unavailable" };
  }
}
