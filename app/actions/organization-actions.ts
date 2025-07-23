"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchOrganizations = async (ids: string[]) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*").in("id", ids);
  if (error) throw new Error("Failed to fetch organizations.");
  return data;
};
