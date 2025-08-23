import { fetchInvitations } from "@/app/actions/invitation-actions";
import { fetchOrganizations } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscriptions } from "@/app/actions/subscription-actions";
import { fetchTeamMemberProfiles } from "@/app/actions/team-member-profile-actions";
import OrganizationsWrapper from "@/components/private/organizations/organizations-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Organizations = async () => {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  try {
    const profile = await fetchProfile(userId);
    const teamMemberProfiles = await fetchTeamMemberProfiles(userId);
    const orgIds = teamMemberProfiles.map((x) => x.org_id);
    const organizations = await fetchOrganizations(orgIds);
    if (organizations.length < 1) throw new Error("No organization found.");
    const subscriptions = await fetchSubscriptions(orgIds);

    return (
      <OrganizationsWrapper
        locale={locale}
        email={email}
        profile={profile}
        organizations={organizations}
        subscriptions={subscriptions}
        teamMemberProfiles={teamMemberProfiles}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};

export default Organizations;
