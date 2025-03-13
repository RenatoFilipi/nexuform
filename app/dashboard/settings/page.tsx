import SettingsWrapper from "@/components/private/settings/settings-wrapper";
import ErrorUI from "@/components/private/shared/error-ui";
import SubscriptionUI from "@/components/private/shared/subscription-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Settings = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) return <ErrorUI />;

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (subscriptionError) return <ErrorUI />;

  const active = isSubscriptionActive(subscription);
  if (!active) return <SubscriptionUI />;

  const { data: formsData, error: formsError } = await supabase.from("forms").select("id").eq("owner_id", data.user.id);

  if (formsError) return <ErrorUI />;

  const idsArray = formsData.map((x) => x.id);
  const startDate = subscription.start_date;
  const dueDate = subscription.due_date;

  const { count: submissionsCount, error: submissionsError } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .in("form_id", idsArray)
    .gte("created_at", startDate)
    .lte("created_at", dueDate);

  if (submissionsError) return <ErrorUI />;

  const locale = await getLocale();

  return (
    <SettingsWrapper
      locale={locale}
      profile={profile}
      subscription={subscription}
      formsCount={formsData.length}
      submissionsCount={submissionsCount ?? 0}
      email={data.user.email ?? ""}
    />
  );
};

export default Settings;
