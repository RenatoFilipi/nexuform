import SettingsWrapper from "@/components/private/form/settings/settings-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Settings = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
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
  if (!active) {
    return <SubscriptionUI email={email} locale={locale} profile={profiles.data} subscription={subscriptions.data} />;
  }

  const form = await supabase.from("forms").select("*").eq("owner_id", userId).eq("id", slug).select().single();
  if (form.error) return <ErrorUI email={email} />;

  return (
    <SettingsWrapper
      email={email}
      locale={locale}
      profile={profiles.data}
      subscription={subscriptions.data}
      form={form.data}
    />
  );
};

export default Settings;
