import { fetchForms } from "@/app/actions/form-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
import FormsWrapper from "@/components/private/organization/forms/forms-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const OrgForms = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
    const subscription = await fetchSubscription(organization.id);
    const context = applyContext(teamMemberProfile, organization, subscription);
    const forms = await fetchForms(organization.id, subscription.forms, true);

    return (
      <FormsWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        forms={forms}
        context={context}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};
export default OrgForms;
