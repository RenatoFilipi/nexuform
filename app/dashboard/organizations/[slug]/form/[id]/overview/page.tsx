import OverviewWrapper from "@/components/private/form2/overview/overview-wrapper";
import ErrorUI from "@/components/shared/utils/error-ui";
import { getDateRangeFromToday } from "@/utils/functions";
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

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const teamMemberProfiles = await supabase.from("team_member_profiles").select("*").eq("profile_id", userId).single();
  if (teamMemberProfiles.error) return <ErrorUI email={email} />;

  const organizations = await supabase.from("organizations").select("*").eq("public_id", slug).single();
  if (organizations.error) return <ErrorUI email={email} />;

  const orgId = organizations.data.id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const forms = await supabase.from("forms").select("*").eq("public_id", id).single();
  if (forms.error) return <ErrorUI email={email} />;

  const dates = getDateRangeFromToday(7);

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .eq("form_id", forms.data.id)
    .gte("created_at", dates.startDate.toISOString())
    .lte("created_at", dates.endDate.toISOString());
  if (submissionLogs.error) return <ErrorUI email={email} />;

  const viewLogs = await supabase
    .from("view_logs")
    .select("*")
    .eq("form_id", forms.data.id)
    .gte("created_at", dates.startDate.toISOString())
    .lte("created_at", dates.endDate.toISOString());
  if (viewLogs.error) return <ErrorUI email={email} />;

  return (
    <OverviewWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      teamMemberProfile={teamMemberProfiles.data}
      organization={organizations.data}
      subscription={subscriptions.data}
      form={forms.data}
      submissionLogs={submissionLogs.data}
      viewLogs={viewLogs.data}
    />
  );
};
export default Overview;
