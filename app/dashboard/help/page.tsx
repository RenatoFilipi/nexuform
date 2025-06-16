import HelpWrapper from "@/components/private/help/help-wrapper";
import ErrorUI from "@/components/shared/utils/error-ui";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Help = async () => {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("/login");
  const email = data.user.email!;
  const userId = data.user.id;

  const profiles = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (profiles.error) return <ErrorUI email={email} />;

  const organizations = await supabase.from("organizations").select("*").eq("owner_id", userId);
  if (organizations.error) return <ErrorUI email={email} />;

  const orgId = organizations.data[0].id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <ErrorUI email={email} />;

  return (
    <HelpWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      organizations={organizations.data}
    />
  );
};

export default Help;

export const metadata: Metadata = {
  title: "Help",
};
