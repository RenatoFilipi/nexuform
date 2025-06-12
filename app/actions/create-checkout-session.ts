"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export const createCheckoutSessionAction = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const customerId = formData.get("customerId") as string;
  const plan = formData.get("plan") as "basic" | "pro";
  const priceId = plan === "basic" ? process.env.STRIPE_BASIC_PLAN_PRICE_ID! : process.env.STRIPE_PRO_PLAN_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    ui_mode: "embedded",
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    payment_method_types: ["card"],
    return_url: `${origin}/dashboard/checkout-result?session_id={CHECKOUT_SESSION_ID}`,
  });
  return session.client_secret as string;
};
