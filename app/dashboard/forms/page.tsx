import DashboardWrapper from "@/components/private/dashboard/dashboard-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Forms = async () => {
  const locale = await getLocale();
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
  if (!active)
    return <SubscriptionUI email={email} locale={locale} profile={profiles.data} subscription={subscriptions.data} />;

  const forms = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true });
  if (forms.error) return <ErrorUI email={email} />;

  return (
    <DashboardWrapper
      locale={locale}
      email={email}
      forms={forms.data}
      profile={profiles.data}
      subscription={subscriptions.data}
    />
  );
};

export default Forms;

export const metadata: Metadata = {
  title: "Dashboard",
};
