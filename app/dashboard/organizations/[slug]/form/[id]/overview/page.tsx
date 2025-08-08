import { fetchForm } from "@/app/actions/form-actions";
import { fetchSubmissionLogs, fetchViewLogs } from "@/app/actions/logs-actions";
import { fetchOrganization } from "@/app/actions/organization-actions";
import { fetchProfile } from "@/app/actions/profile-actions";
import { fetchSubscription } from "@/app/actions/subscription-actions";
import { fetchOrgTeamMemberProfile } from "@/app/actions/team-member-profile-actions";
import OverviewWrapper from "@/components/private/form/overview/overview-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext, getDateRangeFromToday, getPreviousDateRange } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Overview = async ({ params }: { params: Promise<{ slug: string; id: string }> }) => {
  const { slug, id } = await params;
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
    const form = await fetchForm(id, organization.id);
    const dates = getDateRangeFromToday(7);
    const submissionLogs = await fetchSubmissionLogs([form.id], dates.from.toISOString(), dates.to.toISOString());
    const viewLogs = await fetchViewLogs([form.id], dates.from.toISOString(), dates.to.toISOString());
    const previousDates = getPreviousDateRange(dates.from, dates.to);
    const previousSubmissionLogs = await fetchSubmissionLogs(
      [form.id],
      previousDates.from.toISOString(),
      previousDates.to.toISOString()
    );
    const previousViewLogs = await fetchViewLogs(
      [form.id],
      previousDates.from.toISOString(),
      previousDates.to.toISOString()
    );
    const context = applyContext(teamMemberProfile, organization, subscription);

    return (
      <OverviewWrapper
        locale={locale}
        email={email}
        profile={profile}
        teamMemberProfile={teamMemberProfile}
        organization={organization}
        subscription={subscription}
        form={form}
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
export default Overview;
