"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export const fetchClientSecretAction = async () => {
  const origin = (await headers()).get("origin");
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [{ price: "", quantity: 1 }],
    mode: "payment",
    payment_method_types: ["card", "pix"],
    return_url: `${origin}/dashboard/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });
  return session.client_secret;
};
