import FormWrapper from "@/components/private/form/form-wrapper";
import SubscriptionUI from "@/components/private/shared/subscription-ui";
import { day, paginationFrom, paginationTo } from "@/utils/constants";
import { isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
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

  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .eq("id", slug)
    .single();

  if (formError) return <ErrorUI />;

  if (form.owner_id !== data.user.id) {
    return redirect("/dashboard/forms");
  }

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

  return (
    <FormWrapper
      form={form}
      blocks={blocks}
      overviewSubmissions={overviewSubmissions}
      submissions={submissions}
      formAnalytics={formAnalytics}
      profile={profile}
      subscription={subscription}
      email={data.user.email ?? ""}
    />
  );
};

const ErrorUI = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="">Something went wrong</span>
      </div>
    </div>
  );
};

export default Form;
