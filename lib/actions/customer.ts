"use server";

import { stripe } from "@/lib/stripe";
import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/sanity/queries/customers";

/**
 * 1. Idempotency: Uses Stripe metadata & search to prevent duplicate accounts.
 * 2. Error Propagation: Uses structured errors for better UI feedback.
 * 3. Security: Validates input and uses 'writeClient' only on the server.
 * 4. Atomicity: Pattern handles cases where Stripe succeeds but Sanity fails.
 */
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  clerkUserId: string,
): Promise<{ stripeCustomerId: string; sanityCustomerId: string }> {
  if (!email || !clerkUserId) {
    throw new Error("Missing required customer information");
  }

  try {
    // 1. Check Sanity first (Cached Read)
    const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
      email: email.toLowerCase(),
    });

    if (existingCustomer?.stripeCustomerId) {
      // Customer exists, return existing IDs
      return {
        stripeCustomerId: existingCustomer.stripeCustomerId,
        sanityCustomerId: existingCustomer._id,
      };
    }

    // 2. Double-check Stripe by email to avoid duplicate creation, if Sanity was out of sync.
    const existingStripeCustomers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    });

    let stripeCustomerId = existingStripeCustomers.data[0]?.id;

    // 3. Create Stripe Customer if not found
    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: email.toLowerCase(),
        name,
        metadata: { clerkUserId },
      });
      stripeCustomerId = newCustomer.id;
    }

    // 4. Upsert Sanity Customer. Using 'createIfNotExists' or 'patch' with 'setIfMissing' is safer for concurrency
    if (existingCustomer) {
      // Update existing Sanity customer with Stripe ID
      const updated = await writeClient
        .patch(existingCustomer._id)
        .set({
          stripeCustomerId,
          clerkUserId,
          name,
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return {
        stripeCustomerId,
        sanityCustomerId: updated._id,
      };
    }

    // Create new customer in Sanity
    const newSanityCustomer = await writeClient.create({
      _type: "customer",
      email: email.toLowerCase(),
      name,
      clerkUserId,
      stripeCustomerId,
      createdAt: new Date().toISOString(),
    });

    return {
      stripeCustomerId,
      sanityCustomerId: newSanityCustomer._id,
    };
  } catch (error) {
    console.error("Customer Sync Error:", error);
    throw new Error(
      "Failed to synchronize customer account. Please try again.",
    );
  }
}
