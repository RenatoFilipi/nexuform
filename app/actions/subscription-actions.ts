"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchSubscriptions = async (orgIds: string[]) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("subscriptions").select("*").in("org_id", orgIds);
  if (error) throw new Error("Failed to fetch subscription.");
  return data;
};
export const fetchSubscription = async (orgId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (error) throw new Error("Failed to fetch subscription.");
  return data;
};
