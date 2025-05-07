import { stripe } from "@/lib/stripe";
import { Database } from "@/utils/database.types";
import { formatDate } from "@/utils/functions";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Tipos e Configurações
type PlanName = "basic" | "pro" | "custom";

interface PlanConfig {
  priceId: string;
  forms: number;
  submissions: number;
  name: PlanName;
}

interface AppConfig {
  plans: {
    basic: PlanConfig;
    pro: PlanConfig;
  };
}

const config: AppConfig = {
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

// Inicialização do Supabase
const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

// Utilitários
const getPlanByPriceId = (priceId: string): PlanName => {
  if (priceId === config.plans.basic.priceId) return "basic";
  if (priceId === config.plans.pro.priceId) return "pro";
  return "custom";
};

const getPlanConfig = (planName: PlanName) => {
  switch (planName) {
    case "basic":
      return config.plans.basic;
    case "pro":
      return config.plans.pro;
    default:
      return { forms: 3, submissions: 300, name: "custom" };
  }
};

const getProfileByCustomerId = async (customerId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("stripe_customer_id", customerId).single();

  if (error) {
    console.error(`Profile not found for customer: ${customerId}`);
    throw new Error(`Profile not found: ${error.message}`);
  }

  return data;
};

// Função principal para atualizar assinatura no Supabase

const updateSubscriptionInSupabase = async (
  profileId: string,
  subscription: Stripe.Subscription,
  planName: PlanName
) => {
  const planConfig = getPlanConfig(planName);
  const subscriptionItem = subscription.items.data[0];

  const updateData = {
    plan: planName,
    status: subscription.status,
    billing_interval: subscriptionItem.plan.interval,
    start_date: formatDate(subscription.current_period_start),
    due_date: formatDate(subscription.current_period_end),
    updated_at: new Date().toISOString(),
    stripe_subscription_id: subscription.id,
    forms: planConfig.forms,
    submissions: planConfig.submissions,
  };

  const { error } = await supabase.from("subscriptions").update(updateData).eq("profile_id", profileId);

  if (error) throw error;
};

// Função para cancelar assinatura no Supabase
const cancelSubscriptionInSupabase = async (profileId: string) => {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", profileId);

  if (error) throw error;
};

// Função para cancelar assinaturas antigas no Stripe
const cancelOldSubscriptions = async (customerId: string, currentSubscriptionId: string) => {
  const { data: activeSubscriptions } = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
  });

  const oldSubscriptions = activeSubscriptions.filter((sub) => sub.id !== currentSubscriptionId);

  if (oldSubscriptions.length === 0) return;

  await Promise.all(oldSubscriptions.map((sub) => stripe.subscriptions.cancel(sub.id)));
};

// Handlers de Eventos
const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  if (
    session.mode !== "subscription" ||
    typeof session.customer !== "string" ||
    typeof session.subscription !== "string"
  ) {
    throw new Error("Invalid session data");
  }

  const profile = await getProfileByCustomerId(session.customer);
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  const planName = getPlanByPriceId(subscription.items.data[0].price.id);

  // Cancela assinaturas antigas apenas no Stripe
  await cancelOldSubscriptions(session.customer, subscription.id);

  // Atualiza a assinatura existente no Supabase
  await updateSubscriptionInSupabase(profile.id, subscription, planName);
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  const profile = await getProfileByCustomerId(customerId);

  // Verifica se é uma mudança de plano válida
  if (subscription.status === "active" && subscription.items?.data?.length > 0) {
    const planName = getPlanByPriceId(subscription.items.data[0].price.id);
    await updateSubscriptionInSupabase(profile.id, subscription, planName);
  } else {
    // Atualiza apenas o status se não for mudança de plano
    await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq("profile_id", profile.id);
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const customerId = subscription.customer as string;
  const profile = await getProfileByCustomerId(customerId);

  // Verifica todas as assinaturas do cliente no Stripe
  const { data: customerSubscriptions } = await stripe.subscriptions.list({
    customer: customerId,
    status: "all", // Pega todas as assinaturas, independente do status
  });

  // Filtra apenas assinaturas ativas ou não canceladas
  const activeSubscriptions = customerSubscriptions.filter(
    (sub) => sub.status !== "canceled" && sub.status !== "incomplete_expired"
  );

  // Se não houver assinaturas ativas, cancela no Supabase
  if (activeSubscriptions.length === 0) {
    await cancelSubscriptionInSupabase(profile.id);
    console.log(`✅ Todas as assinaturas canceladas - Supabase atualizado para o perfil: ${profile.id}`);
  } else {
    console.log(
      `ℹ️ Assinatura cancelada, mas o usuário ainda tem assinaturas ativas: ${activeSubscriptions
        .map((s) => s.id)
        .join(", ")}`
    );
  }
};
const handleInvoicePaid = async (invoice: Stripe.Invoice) => {
  if (invoice.billing_reason !== "subscription_cycle") return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const profile = await getProfileByCustomerId(invoice.customer as string);

  await supabase
    .from("subscriptions")
    .update({
      due_date: formatDate(subscription.current_period_end),
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", profile.id);
};

const handlePaymentFailed = async (invoice: Stripe.Invoice) => {
  const profile = await getProfileByCustomerId(invoice.customer as string);

  await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", profile.id);
};

// Handler Principal
export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
};
