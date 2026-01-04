import "server-only"; // Prevents this file from being imported in client components
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

/**
 * 1. Singleton: We export a single instance to be used across the server.
 * 2. App Info: Adding 'appInfo' helps Stripe support debug your requests faster.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover", // ".acacia" is the release codename for that version (Stripe uses codenames for major releases)
  appInfo: {
    name: "AI-Ecommerce-Store",
    version: "1.0.0",
  },
  typescript: true, // Ensures strict typing for Stripe objects
});

// We usually only export the instance, but you can export the Type if needed
export type { Stripe };
