import { stripe } from "@/lib/stripe";
import { Database } from "@/utils/database.types";
import { formatDate } from "@/utils/functions";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Configurações
const config = {
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

// Tipos auxiliares
type PlanName = "basic" | "pro" | "custom";
type PlanConfig = {
  forms: number;
  submissions: number;
};

export const POST = async (req: Request) => {
  console.log("🔵 Iniciando processamento do webhook...");

  // Inicialização do Supabase
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
  console.log("🔵 Supabase client inicializado");

  // Helper functions
  const getPlanName = (priceId: string): PlanName => {
    console.log(`🔵 Identificando plano para priceId: ${priceId}`);
    if (priceId === config.plans.basic.priceId) return "basic";
    if (priceId === config.plans.pro.priceId) return "pro";
    return "custom";
  };

  const getPlanConfig = (planName: PlanName): PlanConfig => {
    console.log(`🔵 Obtendo configurações para o plano: ${planName}`);
    switch (planName) {
      case "basic":
        return {
          forms: config.plans.basic.forms,
          submissions: config.plans.basic.submissions,
        };
      case "pro":
        return {
          forms: config.plans.pro.forms,
          submissions: config.plans.pro.submissions,
        };
      default:
        console.log("🟡 Usando configurações padrão para plano customizado");
        return { forms: 3, submissions: 300 };
    }
  };

  const getProfileByStripeCustomerId = async (customerId: string) => {
    console.log(`🔵 Buscando perfil para customerId: ${customerId}`);
    const { data, error } = await supabase.from("profiles").select("*").eq("stripe_customer_id", customerId).single();

    if (error) {
      console.error(`❌ Erro ao buscar perfil: ${error.message}`);
      throw new Error(`Profile not found for customer: ${customerId}`);
    }

    console.log("🟢 Perfil encontrado com sucesso");
    return data;
  };

  // Processamento do webhook
  console.log("🔵 Lendo corpo da requisição...");
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    console.log("🔵 Verificando assinatura do webhook...");
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log("🟢 Assinatura do webhook verificada com sucesso");
  } catch (err: any) {
    console.error("❌ Falha na verificação da assinatura do webhook:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    console.log(`🔵 Processando evento do tipo: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("🔵 Processando checkout.session.completed...");
        const session = event.data.object as Stripe.Checkout.Session;

        // Validações
        console.log("🔵 Validando sessão...");
        if (session.mode !== "subscription") {
          console.error("❌ Modo de sessão inválido - esperado 'subscription'");
          return NextResponse.json({ error: "Invalid session mode - expected subscription" }, { status: 400 });
        }

        if (!session.customer || typeof session.customer !== "string") {
          console.error("❌ ID do cliente ausente ou inválido");
          return NextResponse.json({ error: "Missing or invalid customer ID" }, { status: 400 });
        }

        if (!session.subscription || typeof session.subscription !== "string") {
          console.error("❌ ID de assinatura ausente ou inválido");
          return NextResponse.json({ error: "Missing or invalid subscription ID" }, { status: 400 });
        }

        console.log("🟢 Validações da sessão concluídas com sucesso");

        // Obter dados do perfil e assinatura
        console.log(`🔵 Buscando perfil para customerId: ${session.customer}`);
        const profile = await getProfileByStripeCustomerId(session.customer);

        console.log(`🔵 Recuperando assinatura: ${session.subscription}`);
        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        console.log(`🔵 Identificando plano...`);
        const planName = getPlanName(subscription.items.data[0].price.id);
        const planConfig = getPlanConfig(planName);
        console.log(
          `🟢 Plano identificado: ${planName} com ${planConfig.forms} formulários e ${planConfig.submissions} submissões`
        );

        // Cancelar outras assinaturas ativas
        console.log(`🔵 Buscando outras assinaturas ativas para o cliente...`);
        const activeSubscriptions = await stripe.subscriptions.list({
          customer: session.customer,
          status: "active",
        });

        const subscriptionsToCancel = activeSubscriptions.data.filter((sub) => sub.id !== subscription.id);

        if (subscriptionsToCancel.length > 0) {
          console.log(`🔵 Cancelando ${subscriptionsToCancel.length} assinaturas antigas...`);
          await Promise.all(
            subscriptionsToCancel.map((sub) => {
              console.log(`🔵 Cancelando assinatura: ${sub.id}`);
              return stripe.subscriptions.cancel(sub.id);
            })
          );
          console.log("🟢 Assinaturas antigas canceladas com sucesso");
        } else {
          console.log("🟡 Nenhuma assinatura antiga para cancelar");
        }

        // Atualizar assinatura no Supabase
        console.log(`🔵 Atualizando assinatura no Supabase para o perfil: ${profile.id}`);
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            plan: planName,
            status: subscription.status,
            billing_interval: subscription.items.data[0].plan.interval,
            start_date: formatDate(subscription.current_period_start),
            due_date: formatDate(subscription.current_period_end),
            updated_at: new Date().toISOString(),
            stripe_subscription_id: subscription.id,
            forms: planConfig.forms,
            submissions: planConfig.submissions,
          })
          .eq("profile_id", profile.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar assinatura: ${updateError.message}`);
          throw updateError;
        }

        console.log("🟢 Assinatura atualizada no Supabase com sucesso");
        break;
      }
      default:
        console.log(`🔔 Tipo de evento não tratado: ${event.type}`);
    }
  } catch (error) {
    console.error("❌ Falha no handler do webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  console.log("🟢 Webhook processado com sucesso");
  return new NextResponse(null, { status: 200 });
};
