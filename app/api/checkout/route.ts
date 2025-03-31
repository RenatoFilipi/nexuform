import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          quantity: 1,
          price: "",
        },
      ],
      mode: "subscription",
      payment_method_types: ["card", "pix"],
      return_url: `${request.headers.get("origin")}/dashboard/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.json({ id: session.id, client_secret: session.client_secret });
  } catch (e) {
    console.log(e);
    return Response.json(e, { status: 400 });
  }
}
