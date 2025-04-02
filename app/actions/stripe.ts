"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export const fetchBasicPlanAction = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;
  const price = process.env.STRIPE_BASIC_PLAN_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    customer_email: email,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    mode: "subscription",
    payment_method_types: ["card"],
    return_url: `${origin}/dashboard/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret as string;
};
export const fetchProPlanAction = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;
  const price = process.env.STRIPE_PRO_PLAN_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    customer_email: email,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    mode: "subscription",
    payment_method_types: ["card"],
    return_url: `${origin}/dashboard/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret as string;
};
