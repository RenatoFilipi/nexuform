import OverviewWrapper from "@/components/private/form/overview/overview-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { day } from "@/utils/constants";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Overview = async ({ params }: { params: Promise<{ slug: string }> }) => {
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

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .eq("form_id", slug)
    .gte("created_at", new Date(Date.now() - 30 * day).toISOString());
  if (submissionLogs.error) return <ErrorUI email={email} />;

  const viewLogs = await supabase
    .from("view_logs")
    .select("*")
    .eq("form_id", slug)
    .gte("created_at", new Date(Date.now() - 30 * day).toISOString());
  if (viewLogs.error) return <ErrorUI email={email} />;

  return (
    <OverviewWrapper
      email={email}
      locale={locale}
      profile={profiles.data}
      subscription={subscriptions.data}
      submissionLogs={submissionLogs.data}
      viewLogs={viewLogs.data}
      form={form.data}
    />
  );
};

export default Overview;

export const metadata: Metadata = {
  title: "Form",
};
