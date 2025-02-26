import FormNotAvailableUI from "@/components/private/shared/form-not-available-ui";
import SubmissionWrapper from "@/components/s/submission-wrapper";
import { isSubmissionsLimitReached, isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: form, error: formError } = await supabase.from("forms").select("*").eq("public_url", slug).single();

  if (formError) return <FormNotAvailableUI />;
  if (form.status !== "published") return <FormNotAvailableUI />;

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", form.owner_id)
    .single();

  if (subscriptionError) return <FormNotAvailableUI />;

  const active = isSubscriptionActive(subscription);
  if (!active) return <FormNotAvailableUI />;

  const { data: formsData, error: formsDataError } = await supabase
    .from("forms")
    .select("id")
    .eq("owner_id", subscription.profile_id);

  if (formsDataError) return <FormNotAvailableUI />;

  const idsArray = formsData.map((x) => x.id);
  const startDate = subscription.start_date;
  const dueDate = subscription.due_date;

  const { count: submissionsCount, error: submissionsError } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .in("form_id", idsArray)
    .gte("created_at", startDate)
    .lte("created_at", dueDate);

  if (submissionsError || !submissionsCount) return <FormNotAvailableUI />;
  const limitReached = isSubmissionsLimitReached(subscription, submissionsCount);
  if (limitReached) return <FormNotAvailableUI />;

  const { data: formAnalytics, error: formAnalyticsError } = await supabase
    .from("forms_analytics")
    .select("*")
    .eq("form_id", form.id)
    .single();

  if (formAnalyticsError) return <FormNotAvailableUI />;

  const updatedTotalViews = formAnalytics.total_views + 1;
  const updatedCompletionRate = (formAnalytics.total_submissions / updatedTotalViews) * 100;

  await supabase
    .from("forms_analytics")
    .update({
      total_views: updatedTotalViews,
      avg_completion_rate: updatedCompletionRate,
    })
    .eq("id", formAnalytics.id);

  const { data: theme, error: themeError } = await supabase.from("themes").select("*").eq("form_id", form.id).single();

  if (themeError) return <FormNotAvailableUI />;

  const { data: blocks, error: blocksError } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", form.id)
    .order("position", { ascending: true });

  if (blocksError) return <FormNotAvailableUI />;

  return <SubmissionWrapper form={form} theme={theme} blocks={blocks} />;
};

export default S;
