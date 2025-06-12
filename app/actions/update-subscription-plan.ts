"use server";

import { stripe } from "@/lib/stripe";

export const updateSubscriptionPlanAction = async (formData: FormData) => {
  try {
    const subscriptionId = formData.get("subscriptionId") as string;
    const plan = formData.get("plan") as "basic" | "pro";

    if (!subscriptionId || !plan) {
      return false;
    }

    const newPriceId = plan === "basic" ? process.env.STRIPE_BASIC_PLAN_PRICE_ID : process.env.STRIPE_PRO_PLAN_PRICE_ID;

    if (!newPriceId) {
      return false;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;

    if (!itemId) {
      return false;
    }

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: "create_prorations",
    });

    return true;
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return false;
  }
};
