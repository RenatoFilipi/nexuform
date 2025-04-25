import SettingsWrapper from "@/components/private/settings/settings-wrapper";
import ErrorUI from "@/components/shared/utils/error-ui";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Settings = async () => {
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

  const forms = await supabase.from("forms").select("id").eq("owner_id", userId);
  if (forms.error) return <ErrorUI email={email} />;

  return (
    <SettingsWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      formsCount={forms.data.length}
    />
  );
};

export default Settings;

export const metadata: Metadata = {
  title: "Settings",
};
