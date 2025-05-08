import FormNotAvailableUI from "@/components/private/shared/form/form-not-available-ui";
import SubmissionWrapper from "@/components/public/submission/submission-wrapper";
import { isSubmissionsLimitReached, isSubscriptionActive } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();

  const forms = await supabase.from("forms").select("*").eq("public_url", slug).single();
  if (forms.error) return <FormNotAvailableUI />;
  if (forms.data.status !== "published") return <FormNotAvailableUI />;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("profile_id", forms.data.owner_id).single();
  if (subscriptions.error) return <FormNotAvailableUI />;

  const active = isSubscriptionActive(subscriptions.data);
  if (!active) return <FormNotAvailableUI />;

  const formsIds = await supabase.from("forms").select("id").eq("owner_id", subscriptions.data.profile_id);
  if (formsIds.error) return <FormNotAvailableUI />;

  const startDate = subscriptions.data.start_date;
  const dueDate = subscriptions.data.due_date;

  const submissionLogs = await supabase
    .from("submission_logs")
    .select("*")
    .eq("profile_id", forms.data.owner_id)
    .gte("created_at", startDate)
    .lte("created_at", dueDate);
  if (submissionLogs.error) return <FormNotAvailableUI />;

  const limitReached = isSubmissionsLimitReached(subscriptions.data, submissionLogs.data.length);
  if (limitReached) return <FormNotAvailableUI />;

  await supabase.from("view_logs").insert([{ form_id: forms.data.id, profile_id: forms.data.owner_id }]);

  const themes = await supabase.from("themes").select("*").eq("form_id", forms.data.id).single();
  if (themes.error) return <FormNotAvailableUI />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", forms.data.id)
    .order("position", { ascending: true });
  if (blocks.error) return <FormNotAvailableUI />;

  return <SubmissionWrapper form={forms.data} theme={themes.data} blocks={blocks.data} />;
};

export default S;
