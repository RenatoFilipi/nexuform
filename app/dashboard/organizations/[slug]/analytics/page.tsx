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

  const forms = await supabase.from("forms").select("*").eq("org_id", orgId);
  if (forms.error) return <ErrorUI email={email} />;

  const formIds = forms.data.map((x) => x.id);
  const dates = getDateRangeFromToday(7);

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .in("form_id", formIds)
    .gte("created_at", dates.startDate.toISOString())
    .lte("created_at", dates.endDate.toISOString());
  if (submissionLogs.error) return <ErrorUI email={email} />;

  const viewLogs = await supabase
    .from("view_logs")
    .select("*")
    .in("form_id", formIds)
    .gte("created_at", dates.startDate.toISOString())
    .lte("created_at", dates.endDate.toISOString());
  if (viewLogs.error) return <ErrorUI email={email} />;

  const context = applyContext(teamMemberProfile.data, organization.data);

  return (
    <AnalyticsWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      teamMemberProfile={teamMemberProfile.data}
      organization={organization.data}
      subscription={subscription.data}
      forms={forms.data}
      submissionLogs={submissionLogs.data}
      viewLogs={viewLogs.data}
      context={context}
    />
  );
};
export default Analytics;
