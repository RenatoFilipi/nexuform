"use server";

import { encodedRedirect, nanoid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { createClient as superCreateClient } from "@supabase/supabase-js";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

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
};
export const signUpAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect("error", "/signup", t("required_all_fields"));
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/signup/confirm-email`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/signup", error.message);
  }
  return encodedRedirect("success", "/signup", t("desc_confirm_email"));
};
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
export const createFormAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;
  const supabase = await createClient();

  if (!name || !userId) {
    return encodedRedirect("error", "/dashboard/forms", t("required_all_fields"));
  }

  const { data: form, error: formError } = await supabase
    .from("forms")
    .insert([{ name, description, owner_id: userId, public_url: nanoid(20, true, true) }])
    .select()
    .single();

  if (formError) {
    return encodedRedirect("error", "/dashboard/forms", t("err_generic"));
  }

  return redirect(`/dashboard/editor/${form.id}`);
};
export const refreshFormSlugPageAction = async (slug: string) => {
  if (!slug) {
    return encodedRedirect("error", "/dashboard/forms", "Invalid form slug.");
  }

  revalidatePath(`/dashboard/forms/${slug}`);
};
export const DeleteAccountAction = async (formData: FormData) => {
  const supabase = superCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
  const userId = formData.get("userId") as string;

  if (!userId) {
    return encodedRedirect("error", "/dashboard/settings", "User ID is required.");
  }

  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.log(error);
    return encodedRedirect("error", "/dashboard/settings", "An unexpected error occurred while deleting this account.");
  }

  if (data?.user) {
    return redirect("/login");
  } else {
    return encodedRedirect("error", "/dashboard/settings", "Failed to delete the account.");
  }
};
export const ResetPasswordACtion = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;
  if (!email) {
    return encodedRedirect("error", "/password/reset", t("required_email"));
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/dashboard/settings?resource=update-password`,
  });

  if (error) {
    return encodedRedirect("error", "/password/reset", t("err_generic"));
  }
  return redirect("/dashboard");
};
