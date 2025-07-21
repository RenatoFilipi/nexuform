"use server";

import { stripe } from "@/lib/stripe";
import { TPlan } from "@/utils/pricing";
import { headers } from "next/headers";

export const createCheckoutSessionAction = async (formData: FormData) => {
  try {
    const origin = (await headers()).get("origin");
    const customer_id = formData.get("customer_id") as string;
    const organization_id = formData.get("organization_id") as string;
    const profile_id = formData.get("profile_id") as string;
    const tmp_id = formData.get("tmp_id") as string;
    const email = formData.get("email") as string;
    const plan = formData.get("plan") as TPlan;

    if (!customer_id || !organization_id || !profile_id || !tmp_id || !email || !plan) {
      throw new Error("Missing required fields.");
    }

    const priceId = plan === "starter" ? process.env.STRIPE_STARTER_PRICE_ID! : process.env.STRIPE_PRO_PRICE_ID!;

    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      ui_mode: "embedded",
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      payment_method_types: ["card"],
      return_url: `${origin}/dashboard/checkout-result?session_id={CHECKOUT_SESSION_ID}`,
      subscription_data: {
        metadata: {
          plan,
          customer_id,
          organization_id,
          profile_id,
          tmp_id,
          email,
        },
      },
    });
    return session.client_secret as string;
  } catch (error) {
    throw new Error("Failed to create checkout session.");
  }
};
export const updateSubscriptionPlanAction = async (formData: FormData) => {
  try {
    const subscription_id = formData.get("subscription_id") as string;
    const plan = formData.get("plan") as TPlan;

    if (!subscription_id || !plan) throw new Error("Missing required fields.");

    const priceId = plan === "starter" ? process.env.STRIPE_STARTER_PRICE_ID! : process.env.STRIPE_PRO_PRICE_ID!;
    if (!priceId) throw new Error("Missing price.");

    const subscription = await stripe.subscriptions.retrieve(subscription_id);
    const itemId = subscription.items.data[0]?.id;
    if (!itemId) throw new Error("Missing item.");

    await stripe.subscriptions.update(subscription_id, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: "always_invoice",
    });
  } catch (error) {
    throw new Error("Failed to update checkout session.");
  }
};
