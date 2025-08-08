"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchSubmissionLogs = async (formIds: string[], from: string, to: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submission_logs")
    .select("*")
    .in("form_id", formIds)
    .gte("created_at", from)
    .lte("created_at", to);
  if (error) throw new Error("Failed to fetch submission logs.");
  return data;
};
export const fetchViewLogs = async (formIds: string[], from: string, to: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("view_logs")
    .select("*")
    .in("form_id", formIds)
    .gte("created_at", from)
    .lte("created_at", to);
  if (error) throw new Error("Failed to fetch submission logs.");
  return data;
};
