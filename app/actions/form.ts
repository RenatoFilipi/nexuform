"use server";

import { encodedRedirect, nanoid } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export const createFormAction = async (formData: FormData) => {
  const t = await getTranslations("auth");
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;
  if (!name || !userId) return encodedRedirect("error", "/dashboard/forms", t("required_all_fields"));

  const forms = await supabase
    .from("forms")
    .insert([{ name, description, owner_id: userId, public_url: nanoid(20, true, true) }])
    .select("*")
    .single();
  if (forms.error) return encodedRedirect("error", "/dashboard/forms", t("err_generic"));

  return redirect(`/dashboard/editor/${forms.data.id}`);
};
