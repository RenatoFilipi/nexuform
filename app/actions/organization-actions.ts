"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchOrganizations = async (ids: string[]) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*").in("id", ids);
  if (error) throw new Error("Failed to fetch organizations.");
  return data;
};

export const fetchOrganization = async (publicId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*").eq("public_id", publicId).single();
  if (error) throw new Error("Failed to fetch organization.");
  return data;
};
