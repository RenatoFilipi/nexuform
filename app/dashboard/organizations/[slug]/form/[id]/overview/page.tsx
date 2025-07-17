import OverviewWrapper from "@/components/private/form/overview/overview-wrapper";
import ErrorUI from "@/components/private/shared/pages/error-ui";
import { applyContext, getDateRangeFromToday } from "@/utils/functions";
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

  const form = await supabase.from("forms").select("*").eq("public_id", id).single();
  if (form.error) return <ErrorUI email={email} />;

  const dates = getDateRangeFromToday(7);

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .eq("form_id", form.data.id)
    .gte("created_at", dates.startDate.toISOString())
    .lte("created_at", dates.endDate.toISOString());
  if (submissionLogs.error) return <ErrorUI email={email} />;

  const viewLogs = await supabase
    .from("view_logs")
    .select("*")
    .eq("form_id", form.data.id)
    .gte("created_at", dates.startDate.toISOString())
    .lte("created_at", dates.endDate.toISOString());
  if (viewLogs.error) return <ErrorUI email={email} />;

  const context = applyContext(teamMemberProfile.data, organization.data, subscription.data);

  return (
    <OverviewWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      teamMemberProfile={teamMemberProfile.data}
      organization={organization.data}
      subscription={subscription.data}
      form={form.data}
      submissionLogs={submissionLogs.data}
      viewLogs={viewLogs.data}
      context={context}
      dates={dates}
    />
  );
};
export default Overview;
