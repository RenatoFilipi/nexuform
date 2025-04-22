import FormWrapper from "@/components/private/form/form-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription/subscription-ui";
import ErrorUI from "@/components/shared/utils/error-ui";
import { day, paginationFrom, paginationTo } from "@/utils/constants";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Form = async ({ params }: { params: Promise<{ slug: string }> }) => {
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

  const forms = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true });
  if (forms.error) return <ErrorUI email={email} />;

  const form = forms.data.find((x) => x.id === slug);
  if (!form) return <ErrorUI email={email} />;
  if (form.owner_id !== userId) return redirect("/dashboard/forms");

  const blocks = await supabase.from("blocks").select("*").eq("form_id", slug).order("position", { ascending: true });
  if (blocks.error) return <ErrorUI email={email} />;

  const submissions = await supabase
    .from("submissions")
    .select("*")
    .range(paginationFrom, paginationTo)
    .eq("form_id", slug)
    .order("created_at", { ascending: false });
  if (submissions.error) return <ErrorUI email={email} />;

  const overviewSubmissions = await supabase
    .from("submissions")
    .select("*")
    .eq("form_id", slug)
    .gte("created_at", new Date(Date.now() - 30 * day).toISOString());
  if (overviewSubmissions.error) return <ErrorUI email={email} />;

  const formsAnalytics = await supabase.from("forms_analytics").select("*").eq("form_id", form.id).single();
  if (formsAnalytics.error) return <ErrorUI email={email} />;

  return (
    <FormWrapper
      locale={locale}
      email={email}
      profile={profiles.data}
      form={form}
      forms={forms.data}
      blocks={blocks.data}
      overviewSubmissions={overviewSubmissions.data}
      submissions={submissions.data}
      formAnalytics={formsAnalytics.data}
      subscription={subscriptions.data}
    />
  );
};
export default Form;

export const metadata: Metadata = {
  title: "Form",
};
