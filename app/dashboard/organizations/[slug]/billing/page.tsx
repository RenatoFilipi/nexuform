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

  const startDate = subscription.data.start_date;
  const dueDate = subscription.data.due_date;

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .eq("org_id", orgId)
    .gte("created_at", startDate)
    .lte("created_at", dueDate);

  if (submissionLogs.error) return <ErrorUI email={email} />;

  const context = applyContext(teamMemberProfile.data, organization.data);

  return (
    <BillingWrapper
      locale={locale}
      email={email}
      profile={profile.data}
      teamMemberProfile={teamMemberProfile.data}
      organization={organization.data}
      subscription={subscription.data}
      forms={forms.data}
      submissionLogs={submissionLogs.data}
      context={context}
    />
  );
};

export default Billing;
