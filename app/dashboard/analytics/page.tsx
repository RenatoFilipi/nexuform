import AnalyticsWrapper from "@/components/private/analytics/analytics-wrapper";
import UpgradeToProUI from "@/components/private/shared/subscription/upgrade-to-pro-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

const Analytics = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("profile_id", userId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  const active = isSubscriptionActive(subscriptions.data);
  if (!active || subscriptions.data.plan !== "pro")
    return <UpgradeToProUI email={email} profile={profiles.data} subscription={subscriptions.data} />;

  const forms = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true });
  if (forms.error) return <ErrorUI email={email} />;

  const formIds = forms.data.map((x) => x.id);

  const submissionLogs = await supabase.from("submission_logs").select("*").in("form_id", formIds);
  if (submissionLogs.error) return <ErrorUI email={email} />;

  const viewLogs = await supabase.from("view_logs").select("*").in("form_id", formIds);
  if (viewLogs.error) return <ErrorUI email={email} />;

  return (
    <AnalyticsWrapper
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      submissionLogs={submissionLogs.data}
      viewLogs={viewLogs.data}
      forms={forms.data}
    />
  );
};

export default Analytics;

export const metadata: Metadata = {
  title: "Analytics",
};
