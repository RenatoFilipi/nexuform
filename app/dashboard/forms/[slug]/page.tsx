import FormWrapper from "@/components/private/form/form-wrapper";
import ErrorUI from "@/components/private/shared/error-ui";
import SubscriptionUI from "@/components/private/shared/subscription-ui";
import { day, paginationFrom, paginationTo } from "@/utils/constants";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const Form = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) return <ErrorUI />;

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (subscriptionError) return <ErrorUI />;

  const active = isSubscriptionActive(subscription);
  if (!active) return <SubscriptionUI />;

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: true });

  if (formsError) return <ErrorUI />;

  const form = forms.find((x) => x.id === slug);
  if (!form) return <ErrorUI />;

  if (form.owner_id !== data.user.id) {
    return redirect("/dashboard/forms");
  }

  const { data: integrations, error: integrationsError } = await supabase
    .from("integrations")
    .select("*")
    .eq("form_id", slug)
    .order("created_at", { ascending: false });

  if (integrationsError) return <ErrorUI />;

  const { data: blocks, error: blocksError } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", slug)
    .order("position", { ascending: true });

  if (blocksError) return <ErrorUI />;

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select("*")
    .range(paginationFrom, paginationTo)
    .eq("form_id", slug)
    .order("created_at", { ascending: false });

  if (submissionsError) return <ErrorUI />;

  const { data: overviewSubmissions, error: overviewSubmissionsError } = await supabase
    .from("submissions")
    .select("*")
    .eq("form_id", slug)
    .gte("created_at", new Date(Date.now() - 30 * day).toISOString());

  if (overviewSubmissionsError) return <ErrorUI />;

  const { data: formAnalytics, error: formAnalyticsError } = await supabase
    .from("forms_analytics")
    .select("*")
    .eq("form_id", form.id)
    .single();

  if (formAnalyticsError) return <ErrorUI />;

  const locale = await getLocale();

  return (
    <FormWrapper
      forms={forms}
      locale={locale}
      form={form}
      blocks={blocks}
      overviewSubmissions={overviewSubmissions}
      submissions={submissions}
      formAnalytics={formAnalytics}
      profile={profile}
      subscription={subscription}
      email={data.user.email ?? ""}
      integrations={integrations}
    />
  );
};
export default Form;
