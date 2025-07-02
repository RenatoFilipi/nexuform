"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export const createCheckoutSessionAction = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const customerId = formData.get("customerId") as string;
  const orgId = formData.get("orgId") as string;
  const plan = formData.get("plan") as "basic" | "pro";
  const priceId = plan === "basic" ? process.env.STRIPE_STARTER_PRICE_ID! : process.env.STRIPE_PRO_PRICE_ID!;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    ui_mode: "embedded",
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    payment_method_types: ["card"],
    return_url: `${origin}/dashboard/checkout-result?session_id={CHECKOUT_SESSION_ID}`,
    subscription_data: {
      metadata: {
        organization_id: orgId,
        plan,
      },
    },
  });
  return session.client_secret as string;
};
export const updateSubscriptionPlanAction = async (formData: FormData) => {
  try {
    const subscriptionId = formData.get("subscriptionId") as string;
    const plan = formData.get("plan") as "basic" | "pro";
    if (!subscriptionId || !plan) return false;

    const newPriceId = plan === "basic" ? process.env.STRIPE_BASIC_PLAN_PRICE_ID : process.env.STRIPE_PRO_PLAN_PRICE_ID;
    if (!newPriceId) return false;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;
    if (!itemId) return false;

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: "always_invoice",
    });

    return true;
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return false;
  }
};
