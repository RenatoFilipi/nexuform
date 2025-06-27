import AccountWrapper from "@/components/private2/settings/account/account-wrapper";
import ErrorUI from "@/components/private2/shared/pages/error-ui";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Account = async () => {
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
    <AccountWrapper
      email={email}
      locale={locale}
      profile={profiles.data}
      subscription={subscriptions.data}
      organizations={organizations.data}
    />
  );
};

export default Account;

export const metadata: Metadata = {
  title: "Account",
};
