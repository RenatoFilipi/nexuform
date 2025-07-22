import { stripe } from "@/lib/stripe";
import { Database } from "@/utils/database.types";
import {
  FREE_TRIAL_FORMS,
  FREE_TRIAL_MAX_MEMBERS,
  FREE_TRIAL_PRICE,
  FREE_TRIAL_SUBMISSIONS,
  PRO_FORMS,
  PRO_MAX_MEMBERS,
  PRO_PRICE,
  PRO_SUBMISSIONS,
  STARTER_FORMS,
  STARTER_MAX_MEMBERS,
  STARTER_PRICE,
  STARTER_SUBMISSIONS,
} from "@/utils/envs";
import { TPlan } from "@/utils/pricing";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

interface IPlanConfig {
  name: TPlan;
  forms: number;
  submissions: number;
  maxMembers: number;
  priceId: string;
  amount: number;
}

const freeTrialConfig: IPlanConfig = {
  name: "free_trial",
  forms: FREE_TRIAL_FORMS,
  submissions: FREE_TRIAL_SUBMISSIONS,
  maxMembers: FREE_TRIAL_MAX_MEMBERS,
  amount: FREE_TRIAL_PRICE,
  priceId: "",
};
const starterConfig: IPlanConfig = {
  name: "starter",
  forms: STARTER_FORMS,
  submissions: STARTER_SUBMISSIONS,
  maxMembers: STARTER_MAX_MEMBERS,
  priceId: process.env.STRIPE_BASIC_PLAN_PRICE_ID!,
  amount: STARTER_PRICE,
};
const proConfig: IPlanConfig = {
  name: "pro",
  forms: PRO_FORMS,
  submissions: PRO_SUBMISSIONS,
  maxMembers: PRO_MAX_MEMBERS,
  priceId: process.env.STRIPE_PRO_PLAN_PRICE_ID!,
  amount: PRO_PRICE,
};

const getProfile = async (customerId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("stripe_customer_id", customerId).single();
  if (error) throw new Error(`Profile not found: ${error.message}`);
  return data;
};
const getConfig = (plan: TPlan) => {
  switch (plan) {
    case "starter":
      return starterConfig;
    case "pro":
      return proConfig;
    default:
      return freeTrialConfig;
  }
};
const updateSubscription = async (
  subscription: Stripe.Subscription,
  status: string,
  isNewSubscription: boolean = false
) => {
  const customerId = subscription.customer as string;
  const profile = await getProfile(customerId);

  let plan = subscription.metadata?.plan as TPlan;
  if (!plan) {
    const priceId = subscription.items.data[0]?.price.id;
    plan = priceId === starterConfig.priceId ? "starter" : "pro";
  }

  const config = getConfig(plan);

  const currentPeriodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : new Date().toISOString();

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const subscriptionData = {
    stripe_subscription_id: subscription.id,
    plan: config.name,
    amount: config.amount,
    forms: config.forms,
    submissions: config.submissions,
    billing_interval: subscription.items.data[0]?.price.recurring?.interval || "month",
    start_date: currentPeriodStart,
    due_date: currentPeriodEnd,
    status: status,
    updated_at: new Date().toISOString(),
    max_members: config.maxMembers,
  };

  if (isNewSubscription) {
    const orgId = subscription.metadata?.organization_id;
    if (!orgId) throw new Error("Organization ID not found in subscription metadata");

    const { error } = await supabase
      .from("subscriptions")
      .update({ ...subscriptionData, stripe_subscription_id: subscription.id })
      .eq("profile_id", profile.id)
      .eq("org_id", orgId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("stripe_subscription_id", subscription.id);

    if (error) throw error;
  }
};

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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          await updateSubscription(subscription, "active", true);
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscription(subscription, subscription.status, true);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status === "active" ? "active" : "inactive";
        await updateSubscription(subscription, subscription.status);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            max_members: 1,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) throw error;
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await updateSubscription(subscription, "active");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", invoice.subscription as string);

          if (error) throw error;
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
