import AnalyticsWrapper from "@/components/private/analytics/analytics-wrapper";
import ErrorUI from "@/components/private/shared/error-ui";
import UpgradeToProUI from "@/components/private/shared/upgrade-to-pro-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Analytics = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");
  const email = data.user.email ?? "";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) return <ErrorUI email={email} />;

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (subscriptionError) return <ErrorUI email={email} />;

  const active = isSubscriptionActive(subscription);
  if (!active || subscription.plan !== "pro") return <UpgradeToProUI email={email} />;

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: true });

  if (formsError) return <ErrorUI email={email} />;

  const formIds = forms.map((x) => x.id);

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select("*")
    .in("form_id", formIds);

  if (submissionsError) return <ErrorUI email={email} />;

  const { data: formsAnalytics, error: formsAnalyticsError } = await supabase
    .from("forms_analytics")
    .select("*")
    .eq("profile_id", data.user.id);

  if (formsAnalyticsError) return <ErrorUI email={email} />;

  return (
    <AnalyticsWrapper
      email={email}
      profile={profile}
      subscription={subscription}
      forms={forms}
      formsAnalytics={formsAnalytics}
      submissions={submissions}
    />
  );
};

export default Analytics;
