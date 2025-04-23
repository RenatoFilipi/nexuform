import BillingWrapper from "@/components/private/billing/billing-wrapper";
import ErrorUI from "@/components/shared/utils/error-ui";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Billing = async () => {
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

  const idsArray = forms.data.map((x) => x.id);
  const startDate = subscriptions.data.start_date;
  const dueDate = subscriptions.data.due_date;

  const submissions = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .in("form_id", idsArray)
    .gte("created_at", startDate)
    .lte("created_at", dueDate);
  if (submissions.error) return <ErrorUI email={email} />;

  return (
    <BillingWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      subscription={subscriptions.data}
      formsCount={forms.data.length}
      submissionsCount={submissions.count ?? 0}
    />
  );
};

export default Billing;
