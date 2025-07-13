import MembersWrapper from "@/components/private/organization/members/members-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Members = async ({ params }: { params: Promise<{ slug: string }> }) => {
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

  const teamMemberProfiles = await supabase
    .from("team_member_profiles")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });
  if (teamMemberProfiles.error) return <ErrorUI email={email} />;

  const subscription = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscription.error) return <ErrorUI email={email} />;

  const context = applyContext(teamMemberProfile.data, organization.data);

  return (
    <MembersWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      organization={organization.data}
      subscription={subscription.data}
      teamMemberProfile={teamMemberProfile.data}
      teamMemberProfiles={teamMemberProfiles.data}
      context={context}
    />
  );
};

export default Members;
