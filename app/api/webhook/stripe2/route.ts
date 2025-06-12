import { stripe } from "@/lib/stripe";
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

// event functions

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
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  return new NextResponse(null, { status: 200 });
};

// supabase database tables

// profiles {
//   avatar_url: string | null
//   first_name: string
//   free_trial_due_date: string | null
//   full_name: string | null
//   id: string
//   last_name: string
//   role: string
//   stripe_customer_id: string | null
//   updated_at: string | null
//   username: string | null
//   website: string | null
// }

// subscriptions: {
//   billing_interval: string
//   created_at: string
//   due_date: string
//   forms: number
//   id: string
//   plan: string
//   profile_id: string
//   start_date: string
//   status: string
//   stripe_subscription_id: string | null
//   submissions: number
//   updated_at: string
// }
