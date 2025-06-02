import SubmissionsWrapper from "@/components/private/form/submissions/submissions-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { paginationFrom, paginationTo } from "@/utils/constants";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Submissions = async ({ params }: { params: Promise<{ slug: string }> }) => {
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

  const blocks = await supabase.from("blocks").select("*").eq("form_id", slug).order("position", { ascending: true });
  if (blocks.error) return <ErrorUI email={email} />;

  const submissions = await supabase
    .from("submissions")
    .select("*")
    .range(paginationFrom, paginationTo)
    .eq("form_id", slug)
    .order("created_at", { ascending: false });
  if (submissions.error) return <ErrorUI email={email} />;

  return (
    <SubmissionsWrapper
      email={email}
      locale={locale}
      profile={profiles.data}
      subscription={subscriptions.data}
      form={form.data}
      blocks={blocks.data}
      submissions={submissions.data}
    />
  );
};

export default Submissions;

export const metadata: Metadata = {
  title: "Submissions",
};
