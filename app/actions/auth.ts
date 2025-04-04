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

  try {
    if (!email || !password) {
      return encodedRedirect("error", "/login", t("required_all_fields"));
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return encodedRedirect("error", "/login", error.message);
    }

    return redirect("/dashboard/forms");
  } catch (error) {
    console.log(error);
    encodedRedirect("error", "/login", t("err_generic"));
  }
};
export const signUpAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  try {
    if (!email || !password) {
      return encodedRedirect("error", "/signup", t("required_all_fields"));
    }

    const { data: auth, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/signup/confirm-email`,
      },
    });

    if (authError) {
      return encodedRedirect("error", "/signup", authError.message);
    }

    if (auth.user) {
      const customer = await stripe.customers.create({ email, metadata: { supabase_user_id: auth.user.id } });
      await supabase.from("profiles").update({ stripe_customer_id: customer.id }).eq("id", auth.user.id);
    }

    return encodedRedirect("success", "/signup", t("desc_confirm_email"));
  } catch (error) {
    console.log(error);
    encodedRedirect("error", "/signup", t("err_generic"));
  }
};
export const signOutAction = async () => {
  const t = await getTranslations("auth");

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  } catch (error) {
    console.log(error);
    encodedRedirect("error", "/dashboard/forms", t("err_generic"));
  }
};
export const DeleteAccountAction = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  if (!userId) {
    return encodedRedirect("error", "/dashboard/settings", "User ID is required.");
  }

  try {
    const supabase = superCreateClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    );

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return encodedRedirect("error", "/dashboard/settings", "Failed to retrieve account information.");
    }

    if (profile.stripe_customer_id) {
      const subs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
      });

      if (subs.data.length > 0) {
        await Promise.all(subs.data.map((sub) => stripe.subscriptions.cancel(sub.id)));
      }

      await stripe.customers.del(profile.stripe_customer_id);
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("Auth deletion error:", authError);
      return encodedRedirect("error", "/dashboard/settings", "Failed to delete authentication record.");
    }

    redirect("/login");
  } catch (error) {
    console.error("Account deletion process failed:", error);
    return encodedRedirect("error", "/dashboard/settings", "An unexpected error occurred during account deletion.");
  }
};
export const ResetPasswordAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;

  try {
    if (!email) {
      return encodedRedirect("error", "/password/reset", t("required_email"));
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/password/update`,
    });

    if (error) {
      return encodedRedirect("error", "/password/reset", t("err_generic"));
    }
    return encodedRedirect("success", "/password/reset", t("label_suc_request_password"));
  } catch (error) {
    return encodedRedirect("error", "/password/reset", t("err_generic"));
  }
};
