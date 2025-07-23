import { fetchForms } from "@/app/actions/form-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
import AnalyticsWrapper from "@/components/private/organization/analytics/analytics-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext, getDateRangeFromToday } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Analytics = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
    const formIds = forms.map((x) => x.id);
    const dates = getDateRangeFromToday(7);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .in("form_id", formIds)
      .gte("created_at", dates.startDate.toISOString())
      .lte("created_at", dates.endDate.toISOString());
    if (submissionLogs.error) throw new Error();

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .in("form_id", formIds)
      .gte("created_at", dates.startDate.toISOString())
      .lte("created_at", dates.endDate.toISOString());
    if (viewLogs.error) throw new Error();

    const context = applyContext(teamMemberProfile, organization, subscription);

    return (
      <AnalyticsWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        forms={forms}
        submissionLogs={submissionLogs.data}
        viewLogs={viewLogs.data}
        context={context}
        dates={dates}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};
export default Analytics;
