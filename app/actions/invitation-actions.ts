"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchInvitations = async (email: string, status: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("invitations").select("*").eq("email", email).eq("status", status);
  if (error) throw new Error("Failed to fetch invitations.");
  return data;
};
