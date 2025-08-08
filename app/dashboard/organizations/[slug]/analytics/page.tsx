import { fetchForms } from "@/app/actions/form-actions";
import { fetchSubmissionLogs, fetchViewLogs } from "@/app/actions/logs-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
import AnalyticsWrapper from "@/components/private/organization/analytics/analytics-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext, getDateRangeFromToday, getPreviousDateRange } from "@/utils/functions";
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
    // logs do período atual
    const dates = getDateRangeFromToday(7);
    const submissionLogs = await fetchSubmissionLogs(formIds, dates.from.toISOString(), dates.to.toISOString());
    const viewLogs = await fetchViewLogs(formIds, dates.from.toISOString(), dates.to.toISOString());
    // logs do período anterior
    const previousDates = getPreviousDateRange(dates.from, dates.to);
    const previousSubmissionLogs = await fetchSubmissionLogs(
      formIds,
      previousDates.from.toISOString(),
      previousDates.to.toISOString()
    );
    const previousViewLogs = await fetchViewLogs(
      formIds,
      previousDates.from.toISOString(),
      previousDates.to.toISOString()
    );
    const context = applyContext(teamMemberProfile, organization, subscription);

    console.log(
      "\x1b[32m%s\x1b[0m", // verde
      "📅 Atual:",
      dates.from.toLocaleString(),
      "-",
      dates.to.toLocaleString()
    );

    console.log(
      "\x1b[33m%s\x1b[0m", // amarelo
      "📅 Anterior:",
      previousDates.from.toLocaleString(),
      "-",
      previousDates.to.toLocaleString()
    );

    return (
      <AnalyticsWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        forms={forms}
        submissionLogs={submissionLogs}
        viewLogs={viewLogs}
        submissionLogsCompare={previousSubmissionLogs}
        viewLogsCompare={previousViewLogs}
        context={context}
        dates={dates}
      />
    );
  } catch (error) {
    return <ErrorUI email={email} />;
  }
};
export default Analytics;
