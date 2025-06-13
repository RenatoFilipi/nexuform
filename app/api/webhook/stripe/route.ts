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
const getPlan = (priceId: string): plan => {
  if (priceId === config.plans.basic.priceId) return "basic";
  if (priceId === config.plans.pro.priceId) return "pro";
  return "custom";
};

const getConfig = (plan: plan): IPlan => {
  if (plan === "basic") return config.plans.basic;
  if (plan === "pro") return config.plans.pro;
  return { forms: 3, submissions: 300, name: "custom", priceId: "" };
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

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (!invoice.subscription || !invoice.customer || !invoice.lines?.data?.length) break;

        const customerId = invoice.customer as string;
        const subscriptionId = invoice.subscription as string;

        const latestLineItem = invoice.lines.data.find((line) => line.type === "subscription");
        if (!latestLineItem || !latestLineItem.price?.id) break;

        const priceId = latestLineItem.price.id;
        const plan = getPlan(priceId);
        const planConfig = getConfig(plan);
        const profile = await getProfile(customerId);

        const startDate = invoice.period_start
          ? new Date(invoice.period_start * 1000).toISOString()
          : new Date().toISOString();

        const dueDate = invoice.period_end
          ? new Date(invoice.period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * day).toISOString();

        const now = new Date().toISOString();

        const { data: currentSubscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("profile_id", profile.id)
          .single();

        if (subError || !currentSubscription) {
          throw new Error(`Subscription not found for profile ${profile.id}`);
        }

        const isPendingUpdateEffective =
          currentSubscription.pending_plan != null &&
          currentSubscription.pending_update_status === "pending" &&
          currentSubscription.pending_effective_date != null &&
          currentSubscription.pending_effective_date <= now &&
          currentSubscription.pending_forms != null &&
          currentSubscription.pending_submissions != null;

        const isFirstActivation =
          currentSubscription.status === "free_trial" || !currentSubscription.stripe_subscription_id;

        if (isPendingUpdateEffective) {
          await supabase
            .from("subscriptions")
            .update({
              plan: currentSubscription.pending_plan ?? "basic",
              forms: currentSubscription.pending_forms ?? 0,
              submissions: currentSubscription.pending_submissions ?? 0,
              start_date: startDate,
              due_date: dueDate,
              billing_interval: latestLineItem.price.recurring?.interval || "month",
              status: "active",
              stripe_subscription_id: subscriptionId,
              pending_plan: null,
              pending_forms: null,
              pending_submissions: null,
              pending_effective_date: null,
              pending_update_requested_at: null,
              pending_update_status: null,
              updated_at: now,
            })
            .eq("profile_id", profile.id);
        } else if (isFirstActivation) {
          await supabase
            .from("subscriptions")
            .update({
              plan,
              forms: planConfig.forms,
              submissions: planConfig.submissions,
              start_date: startDate,
              due_date: dueDate,
              billing_interval: latestLineItem.price.recurring?.interval || "month",
              status: "active",
              stripe_subscription_id: subscriptionId,
              updated_at: now,
            })
            .eq("profile_id", profile.id);
        } else {
          await supabase
            .from("subscriptions")
            .update({
              plan,
              forms: planConfig.forms,
              submissions: planConfig.submissions,
              start_date: startDate,
              due_date: dueDate,
              billing_interval: latestLineItem.price.recurring?.interval || "month",
              status: "active",
              stripe_subscription_id: subscriptionId,
              updated_at: now,
            })
            .eq("profile_id", profile.id);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
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
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
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
