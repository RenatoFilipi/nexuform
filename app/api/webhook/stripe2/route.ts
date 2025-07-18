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
  maxUsers: number;
  priceId: string;
  amount: number;
}
const freeTrialConfig: IPlanConfig = {
  name: "free_trial",
  forms: FREE_TRIAL_FORMS,
  submissions: FREE_TRIAL_SUBMISSIONS,
  maxUsers: FREE_TRIAL_MAX_MEMBERS,
  amount: FREE_TRIAL_PRICE,
  priceId: "",
};
const starterConfig: IPlanConfig = {
  name: "starter",
  forms: STARTER_FORMS,
  submissions: STARTER_SUBMISSIONS,
  maxUsers: STARTER_MAX_MEMBERS,
  priceId: process.env.STRIPE_BASIC_PLAN_PRICE_ID!,
  amount: STARTER_PRICE,
};
const proConfig: IPlanConfig = {
  name: "pro",
  forms: PRO_FORMS,
  submissions: PRO_SUBMISSIONS,
  maxUsers: PRO_MAX_MEMBERS,
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
      }
      case "customer.subscription.created": {
      }
      case "customer.subscription.updated": {
      }
      case "customer.subscription.deleted": {
      }
      case "invoice.payment_failed": {
      }
      case "invoice.paid": {
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
        console.log(event.data.object);
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
