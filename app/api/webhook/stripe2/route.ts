import { stripe } from "@/lib/stripe";
import { day } from "@/utils/constants";
import { Database } from "@/utils/database.types";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// utils
type plan = "basic" | "pro" | "custom";
interface IPlan {
  priceId: string;
  forms: number;
  submissions: number;
  name: plan;
}
interface IConfig {
  plans: {
    basic: IPlan;
    pro: IPlan;
  };
}
const config: IConfig = {
  plans: {
    basic: {
      priceId: process.env.STRIPE_BASIC_PLAN_PRICE_ID!,
      forms: parseInt(process.env.NEXT_PUBLIC_PLAN_BASIC_FORMS!),
      submissions: parseInt(process.env.NEXT_PUBLIC_PLAN_BASIC_SUBMISSIONS!),
      name: "basic",
    },
    pro: {
      priceId: process.env.STRIPE_PRO_PLAN_PRICE_ID!,
      forms: parseInt(process.env.NEXT_PUBLIC_PLAN_PRO_FORMS!),
      submissions: parseInt(process.env.NEXT_PUBLIC_PLAN_PRO_SUBMISSIONS!),
      name: "pro",
    },
  },
};
const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

// handler functions
const getPlan = (priceId: string) => {
  if (priceId === config.plans.basic.priceId) return "basic";
  if (priceId === config.plans.pro.priceId) return "pro";
  return "custom";
};
const getConfig = (plan: plan) => {
  if (plan === "basic") return config.plans.basic;
  if (plan === "pro") return config.plans.pro;
  return { forms: 3, submissions: 300, name: "custom", priceId: "" } as IPlan;
};
const getProfile = async (customerId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("stripe_customer_id", customerId).single();
  if (error) throw new Error(`Profile not found: ${error.message}`);
  return data;
};

// main
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
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription object:", JSON.stringify(subscription, null, 2));
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;
        const plan = getPlan(priceId);
        const config = getConfig(plan);
        const profile = await getProfile(customerId);

        const startDate = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : new Date().toISOString();

        const dueDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * day).toISOString();

        await supabase
          .from("subscriptions")
          .update({
            plan,
            forms: config.forms,
            submissions: config.submissions,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            start_date: startDate,
            due_date: dueDate,
            billing_interval: subscription.items.data[0].price.recurring?.interval || "month",
            updated_at: new Date().toISOString(),
          })
          .eq("profile_id", profile.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription object:", JSON.stringify(subscription, null, 2));
        const customerId = subscription.customer as string;

        let profile;
        try {
          profile = await getProfile(customerId);
        } catch (err) {
          console.warn(`Webhook ignored: profile for customer ${customerId} not found`);
          break;
        }

        await supabase
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("profile_id", profile.id);
        break;
      }
      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  return new NextResponse(null, { status: 200 });
};
