import { stripe } from "@/lib/stripe";
import { Database } from "@/utils/database.types";
import { formatDate } from "@/utils/functions";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const basicPlanPriceId = process.env.STRIPE_BASIC_PLAN_PRICE_ID!;
const proPlanPriceId = process.env.STRIPE_PRO_PLAN_PRICE_ID!;

export const POST = async (req: Request) => {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const planName = (priceId: string) => {
    switch (priceId) {
      case basicPlanPriceId:
        return "basic";
      case proPlanPriceId:
        return "pro";
      default:
        return "custom";
    }
  };
  const profileByStripe = async (id: string) => {
    return await supabase.from("profiles").select("*").eq("stripe_customer_id", id).single();
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(event.data.object.id);

        if (session.mode !== "subscription" || !session.customer || !session.subscription) {
          return new NextResponse("Invalid subscription session", { status: 400 });
        }
        const customerId = session.customer.toString();
        const { data: profile, error: profileError } = await profileByStripe(customerId);

        if (profileError) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }
        console.log(profile);

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log(subscription);

        const subscriptionData = {
          plan: planName(subscription.items.data[0].price.id),
          status: subscription.status,
          billing_interval: subscription.items.data[0].plan.interval as string,
          start_date: formatDate(subscription.current_period_start),
          due_date: formatDate(subscription.current_period_end),
          updated_at: new Date().toISOString(),
        };
        console.log(subscriptionData);

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Subscription update failed:", updateError);
          throw updateError;
        }
        console.log("✅ Subscription created/updated:", subscription.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(event.data.object.id);

        const customerId = subscription.customer.toString();
        const { data: profile, error: profileError } = await profileByStripe(customerId);

        if (profileError) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const { error: subscriptionsError } = await supabase
          .from("subscriptions")
          .update({ status: subscription.status })
          .eq("profile_id", profile.id);

        if (subscriptionsError) {
          console.log(subscriptionsError);
          return new NextResponse(null, { status: 400 });
        }

        console.log("✅ Subscription deleted:", subscription.id);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = await stripe.subscriptions.retrieve(event.data.object.id);
        const customerId = subscription.customer.toString();
        const { data: profile, error: profileError } = await profileByStripe(customerId);

        if (profileError) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const subscriptionData = {
          plan: planName(subscription.items.data[0].price.id),
          status: subscription.status,
          billing_interval: subscription.items.data[0].plan.interval as string,
          start_date: formatDate(subscription.current_period_start),
          due_date: formatDate(subscription.current_period_end),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Subscription update failed:", updateError);
          throw updateError;
        }
        console.log("✅ Subscription created/updated:", subscription.id);
        break;
      }
      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
};
