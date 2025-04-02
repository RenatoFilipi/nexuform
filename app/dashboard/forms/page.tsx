import DashboardWrapper from "@/components/private/dashboard/dashboard-wrapper";
import ErrorUI from "@/components/private/shared/error-ui";
import SubscriptionUI from "@/components/private/shared/subscription-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Forms = async () => {
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
  if (!active) return <SubscriptionUI email={email} />;

  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: true });

  if (formError) return <ErrorUI email={email} />;

  const locale = await getLocale();

  return <DashboardWrapper locale={locale} forms={form} profile={profile} subscription={subscription} email={email} />;
};

export default Forms;
