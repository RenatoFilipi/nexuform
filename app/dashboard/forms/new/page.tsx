import NewWrapper from "@/components/private/new/new-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const New = async () => {
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

  const active = isSubscriptionActive(subscriptions.data);
  if (!active) {
    return <SubscriptionUI email={email} locale={locale} profile={profiles.data} subscription={subscriptions.data} />;
  }

  const forms = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true });
  if (forms.error) return <ErrorUI email={email} />;

  return (
    <NewWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      forms={forms.data}
      organizations={organizations.data}
    />
  );
};

export default New;

export const metadata: Metadata = {
  title: "New form",
};
