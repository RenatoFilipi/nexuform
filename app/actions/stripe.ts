"use server";

import { stripe } from "@/lib/stripe";
import { TPlan } from "@/utils/pricing";
import { headers } from "next/headers";

export const createCheckoutSessionAction = async (formData: FormData) => {
  try {
    const origin = (await headers()).get("origin");
    if (!origin) throw new Error("Missing request origin.");

    const customerId = formData.get("customer_id") as string;
    const organizationId = formData.get("organization_id") as string;
    const profileId = formData.get("profile_id") as string;
    const tmpId = formData.get("tmp_id") as string;
    const email = formData.get("email") as string;
    const plan = formData.get("plan") as TPlan;

    if (!customerId || !organizationId || !profileId || !tmpId || !email || !plan) {
      throw new Error("Missing required fields in form data.");
    }

    const priceMap: Record<TPlan, string | undefined> = {
      starter: process.env.STRIPE_STARTER_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
      free_trial: undefined,
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      throw new Error(`Stripe price ID not configured for plan: ${plan}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      ui_mode: "embedded",
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      return_url: `${origin}/dashboard/checkout-result?session_id={CHECKOUT_SESSION_ID}`,
      subscription_data: {
        metadata: {
          plan,
          customer_id: customerId,
          organization_id: organizationId,
          profile_id: profileId,
          tmp_id: tmpId,
          email,
          created_at: new Date().toISOString(),
        },
      },
    });

    return session.client_secret as string;
  } catch (error: any) {
    console.error("Failed to create Stripe Checkout Session:", error);
    throw new Error(error?.message || "Failed to create checkout session.");
  }
};
export const updateSubscriptionPlanAction = async (formData: FormData) => {
  try {
    const subscriptionId = formData.get("subscription_id") as string;
    const plan = formData.get("plan") as TPlan;

    if (!subscriptionId || !plan) {
      throw new Error("Missing required fields: subscription_id or plan.");
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const priceMap: Record<TPlan, string | undefined> = {
      starter: process.env.STRIPE_STARTER_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
      free_trial: undefined,
    };

    const priceId = priceMap[plan];
    if (!priceId) {
      throw new Error(`Missing Stripe price ID for plan: ${plan}`);
    }

    const itemId = subscription.items.data[0]?.id;
    if (!itemId) {
      throw new Error("Stripe subscription item ID not found.");
    }

    const updatedMetadata = {
      ...subscription.metadata,
      plan,
      previous_plan: subscription.metadata?.plan,
      plan_changed_at: new Date().toISOString(),
    };

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: "always_invoice",
      metadata: updatedMetadata,
    });
  } catch (error: any) {
    console.error("Error updating subscription plan:", error);
    throw new Error(error?.message || "Failed to update subscription plan.");
  }
};
