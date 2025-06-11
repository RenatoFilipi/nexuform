import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;
  let event: Stripe.Event;

  // validate signature
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // handle events
  try {
    switch (event.type) {
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  return new NextResponse(null, { status: 200 });
};

// handler functions
