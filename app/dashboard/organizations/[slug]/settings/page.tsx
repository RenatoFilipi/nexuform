import SettingsWrapper from "@/components/private/organization/settings/settings-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Settings = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profile = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profile.error) return <ErrorUI email={email} />;

  const organization = await supabase.from("organizations").select("*").eq("public_id", slug).single();
  if (organization.error) return <ErrorUI email={email} />;

  const orgId = organization.data.id;

  const teamMemberProfile = await supabase
    .from("team_member_profiles")
    .select("*")
    .eq("profile_id", userId)
    .eq("org_id", orgId)
    .single();
  if (teamMemberProfile.error) return <ErrorUI email={email} />;

  const subscription = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscription.error) return <ErrorUI email={email} />;

  return (
    <SettingsWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      teamMemberProfile={teamMemberProfile.data}
      organization={organization.data}
      subscription={subscription.data}
    />
  );
};
export default Settings;
