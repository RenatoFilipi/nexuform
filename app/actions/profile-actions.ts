"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchProfile = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error) throw new Error("Failed to fetch profile.");
  return data;
};
