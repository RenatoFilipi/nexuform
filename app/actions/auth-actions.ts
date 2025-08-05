"use server";

import { stripe } from "@/lib/stripe";
import { Database } from "@/utils/database.types";
import { encodedRedirect } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { createClient as superCreateClient } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) return encodedRedirect("error", "/login", t("required_all_fields"));
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return encodedRedirect("error", "/login", error.message);

  return redirect("/dashboard/organizations");
};
export const signUpAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !first_name || !last_name)
    return encodedRedirect("error", "/signup", t("required_all_fields"));

  const { data: auth, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/signup/confirm-email`,
      data: {
        first_name,
        last_name,
        email,
      },
    },
  });
  if (authError) return encodedRedirect("error", "/signup", authError.message);

  if (auth.user) {
    const customer = await stripe.customers.create({ email, metadata: { supabase_user_id: auth.user.id } });
    await supabase.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", auth.user.id);
  }

  return encodedRedirect("success", "/signup", t("desc_confirm_email"));
};
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
export const DeleteAccountAction = async (formData: FormData) => {
  const supabase = superCreateClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const userId = formData.get("userId") as string;
  if (!userId) {
    return encodedRedirect("error", "/dashboard/settings", "User ID is required.");
  }

  // 1. Obtem o stripe_customer_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Erro ao buscar o perfil:", profileError?.message);
    return encodedRedirect("error", "/dashboard/settings", "Failed to retrieve account information.");
  }

  const customerId = profile.stripe_customer_id;

  // 2. Cancela assinaturas e deleta o cliente da Stripe (se existir)
  if (customerId) {
    try {
      const { data: subscriptions } = await stripe.subscriptions.list({ customer: customerId });

      if (subscriptions.length > 0) {
        await Promise.all(subscriptions.map((sub) => stripe.subscriptions.cancel(sub.id)));
      }

      await stripe.customers.del(customerId);
    } catch (err) {
      console.error("Erro ao cancelar assinatura ou deletar cliente da Stripe:", err);
      return encodedRedirect("error", "/dashboard/settings", "Stripe account cleanup failed.");
    }
  }

  // 3. Deleta o usuário da autenticação
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.error("Erro ao deletar usuário do Supabase Auth:", authError.message);
    return encodedRedirect("error", "/dashboard/settings", "Failed to delete authentication record.");
  }

  // 4. Redireciona
  redirect("/login");
};
export const ResetPasswordAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;

  if (!email) {
    return encodedRedirect("error", "/forgot-password", t("required_email"));
  }

  const redirectTo = `${origin}/auth/callback?redirect_to=/dashboard/account/password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return encodedRedirect("error", "/forgot-password", t("err_generic"));
  }

  return encodedRedirect("success", "/forgot-password", t("label_suc_request_password"));
};
export const CancelSubscriptionAction = async (formData: FormData) => {
  const t = await getTranslations("auth");

  const stripeSubscriptionId = formData.get("stripeSubscriptionId") as string | null;
  const orgPublicId = formData.get("orgPublicId") as string | null;

  if (!stripeSubscriptionId || !orgPublicId) {
    return encodedRedirect("error", `/dashboard/organizations/${orgPublicId ?? "unknown"}/billing`, t("err_generic"));
  }

  const supabase = superCreateClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  let result;
  try {
    result = await stripe.subscriptions.cancel(stripeSubscriptionId);
  } catch (err) {
    return encodedRedirect("error", `/dashboard/organizations/${orgPublicId}/billing`, t("err_generic"));
  }

  if (result.status !== "canceled") {
    return encodedRedirect("error", `/dashboard/organizations/${orgPublicId}/billing`, t("err_generic"));
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      max_members: 1,
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (error) {
    return encodedRedirect("error", `/dashboard/organizations/${orgPublicId}/billing`, t("err_generic"));
  }

  return encodedRedirect("success", `/dashboard/organizations/${orgPublicId}/billing`, t("label_plan_canceled"));
};
