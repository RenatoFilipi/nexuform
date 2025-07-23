import { fetchForms } from "@/app/actions/form-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
import BillingWrapper from "@/components/private/organization/billing/billing-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Billing = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
    const forms = await fetchForms(organization.id, subscription.forms, true);
    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .eq("org_id", organization.id)
      .gte("created_at", subscription.start_date)
      .lte("created_at", subscription.due_date);

    if (submissionLogs.error) return <ErrorUI email={email} />;

    const context = applyContext(teamMemberProfile, organization, subscription);

    return (
      <BillingWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        forms={forms}
        submissionLogs={submissionLogs.data}
        context={context}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};

export default Billing;
