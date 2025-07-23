"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchTeamMemberProfile = async (profileId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_member_profiles").select("*").eq("profile_id", profileId).single();
  if (error) throw new Error("Failed to fetch team member profile.");
  return data;
};
export const fetchTeamMemberProfiles = async (profileId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_member_profiles").select("*").eq("profile_id", profileId);
  if (error) throw new Error("Failed to fetch team member profile.");
  return data;
};
