import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const supabase = await createClient();
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const basicPlanPriceId = process.env.STRIPE_BASIC_PLAN_PRICE_ID!;
  const proPlanPriceId = process.env.STRIPE_PRO_PLAN_PRICE_ID!;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const formatDate = (unixTimestamp: number) => {
    return new Date(unixTimestamp * 1000).toISOString();
  };
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
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "subscription" || !session.customer) {
          return new NextResponse("Invalid subscription session", { status: 400 });
        }

        const { data: profile, error: profileError } = await profileByStripe(session.customer.toString());

        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const subscriptionData = {
          id: subscription.id,
          profile_id: profile.id,
          plan: planName(subscription.items.data[0].price.id),
          status: subscription.status,
          billing_interval: subscription.items.data[0].plan.interval as string,
          start_date: formatDate(subscription.current_period_start),
          due_date: formatDate(subscription.current_period_end),
          created_at: formatDate(subscription.created),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Subscription upsert failed:", updateError);
          throw updateError;
        }

        console.log("✅ Subscription created/updated:", subscription.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: profile, error: profileError } = await profileByStripe(subscription.customer.toString());

        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Failed to cancel subscription:", updateError);
          throw updateError;
        }

        console.log("❌ Subscription canceled:", subscription.id);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (!invoice.customer || !invoice.subscription) {
          return new NextResponse("Invalid invoice data", { status: 400 });
        }

        const { data: profile, error: profileError } = await profileByStripe(invoice.customer.toString());

        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            due_date: formatDate(subscription.current_period_end),
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Failed to update subscription after payment:", updateError);
          throw updateError;
        }

        console.log("✅ Invoice payment succeeded for subscription:", subscription.id);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        if (!invoice.customer || !invoice.subscription) {
          return new NextResponse("Invalid invoice data", { status: 400 });
        }

        const { data: profile, error: profileError } = await profileByStripe(invoice.customer.toString());

        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Failed to update subscription after payment failure:", updateError);
          throw updateError;
        }

        console.log("❌ Invoice payment failed for customer:", invoice.customer);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: profile, error: profileError } = await profileByStripe(subscription.customer.toString());

        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            plan: planName(subscription.items.data[0].price.id),
            billing_interval: subscription.items.data[0].plan.interval as string,
            due_date: formatDate(subscription.current_period_end),
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Failed to update subscription:", updateError);
          throw updateError;
        }

        console.log("🔄 Subscription updated:", subscription.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: profile, error: profileError } = await profileByStripe(subscription.customer.toString());

        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return new NextResponse("Profile not found", { status: 404 });
        }

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error("Failed to cancel subscription:", updateError);
          throw updateError;
        }

        console.log("❌ Subscription canceled:", subscription.id);
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
