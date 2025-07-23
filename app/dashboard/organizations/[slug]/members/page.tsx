import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
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

  try {
    const profile = await fetchProfile(userId);
    const organization = await fetchOrganization(slug);
    const teamMemberProfile = await fetchOrgTeamMemberProfile(userId, organization.id);

    const teamMemberProfiles = await supabase
      .from("team_member_profiles")
      .select("*")
      .eq("org_id", organization.id)
      .order("created_at", { ascending: true });
    if (teamMemberProfiles.error) return <ErrorUI email={email} />;

    const subscription = await fetchSubscription(organization.id);

    const context = applyContext(teamMemberProfile, organization, subscription);

    return (
      <MembersWrapper
        locale={locale}
        email={email}
        profile={profile}
        organization={organization}
        subscription={subscription}
        teamMemberProfile={teamMemberProfile}
        teamMemberProfiles={teamMemberProfiles.data}
        context={context}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};

export default Members;
