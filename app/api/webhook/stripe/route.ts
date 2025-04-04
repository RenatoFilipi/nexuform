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

        if (profileError) return new NextResponse("Profile not found", { status: 404 });

        const newSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const newPlan = planName(newSubscription.items.data[0].price.id);

        const { data: currentSubscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("profile_id", profile.id)
          .single();

        if (subError && !currentSubscription) {
          return new NextResponse("Subscription not found", { status: 404 });
        }

        // Cancela todas as outras assinaturas ativas
        const activeSubscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
        });

        await Promise.all(
          activeSubscriptions.data
            .filter((sub) => sub.id !== newSubscription.id)
            .map((sub) => stripe.subscriptions.cancel(sub.id))
        );

        // Atualiza com o status da NOVA assinatura
        const subscriptionData = {
          plan: newPlan,
          status: newSubscription.status, // Usa o status direto da nova assinatura
          billing_interval: newSubscription.items.data[0].plan.interval as string,
          start_date: formatDate(newSubscription.current_period_start),
          due_date: formatDate(newSubscription.current_period_end),
          updated_at: new Date().toISOString(),
          stripe_subscription_id: newSubscription.id,
        };

        const { error: updateError } = await supabase
          .from("subscriptions")
          .update(subscriptionData)
          .eq("profile_id", profile.id);

        if (updateError) {
          throw updateError;
        }
        break;
      }
      // case "customer.subscription.deleted": {
      //   break;
      // }
      // case "customer.subscription.updated": {
      // }
      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
};
