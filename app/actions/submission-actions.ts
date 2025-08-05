"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchForm = async (publicId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("public_id", publicId)
    .eq("status", "published")
    .single();
  if (error) throw new Error("Failed to fetch form.");
  return data;
};
export const fetchOrganization = async (orgId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .eq("status", "active")
    .single();
  if (error) throw new Error("Failed to fetch organization.");
  return data;
};
export const fetchSubscription = async (orgId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("org_id", orgId)
    .eq("status", "active")
    .single();
  if (error) throw new Error("Failed to fetch subscription.");
  return data;
};
export const fetchTheme = async (formId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("themes").select("*").eq("form_id", formId).single();
  if (error) throw new Error("Failed to fetch theme.");
  return data;
};
export const fetchBlocks = async (formId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", formId)
    .order("position", { ascending: true });
  if (error) throw new Error("Failed to fetch blocks.");
  return data;
};
