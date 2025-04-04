import AnalyticsWrapper from "@/components/private/analytics/analytics-wrapper";
import ErrorUI from "@/components/private/shared/error-ui";
import UpgradeToProUI from "@/components/private/shared/upgrade-to-pro-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
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
  const submissions = await supabase.from("submissions").select("*").in("form_id", formIds);
  if (submissions.error) return <ErrorUI email={email} />;

  const formsAnalytics = await supabase.from("forms_analytics").select("*").eq("profile_id", userId);
  if (formsAnalytics.error) return <ErrorUI email={email} />;

  return (
    <AnalyticsWrapper
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      forms={forms.data}
      formsAnalytics={formsAnalytics.data}
      submissions={submissions.data}
    />
  );
};

export default Analytics;
