"use server";

import { encodedRedirect, nanoid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/signup", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/signup",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
export const createFormAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const userId = formData.get("userId") as string;
  const supabase = await createClient();

  const { data: form, error: formError } = await supabase
    .from("forms")
    .insert([{ name, owner_id: userId, public_url: nanoid(20, true, true) }])
    .select()
    .single();

  if (formError) {
    return encodedRedirect(
      "error",
      "/dashboard/forms",
      "An unexpected error occurred while creating the form. Please try again later."
    );
  }

  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .insert([{ form_id: form.id }])
    .select()
    .single();

  if (themeError) {
    await supabase.from("forms").delete().eq("id", form.id);
    return encodedRedirect(
      "error",
      "/dashboard/forms",
      "An unexpected error occurred while creating the form. Please try again later."
    );
  }

  const { error: analyticsError } = await supabase
    .from("forms_analytics")
    .insert([{ form_id: form.id, profile_id: userId }]);

  if (analyticsError) {
    await supabase.from("forms").delete().eq("id", form.id);
    await supabase.from("themes").delete().eq("id", theme.id);
    return encodedRedirect(
      "error",
      "/dashboard/forms",
      "An unexpected error occurred while creating the form. Please try again later."
    );
  }

  return redirect(`/dashboard/editor/${form.id}`);
};

// to fix this actions
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};
