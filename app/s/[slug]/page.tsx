import SubmissionFormNotAvailableUI from "@/components/public/submission/submission-form-not-available-ui";
import SubmissionWrapper from "@/components/public/submission/submission-wrapper";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();

  const form = await supabase.from("forms").select("*").eq("public_id", slug).single();
  if (form.error || form.data.status !== "published") return <SubmissionFormNotAvailableUI />;

  const organization = await supabase.from("organizations").select("*").eq("id", form.data.org_id).single();
  if (organization.error) return <SubmissionFormNotAvailableUI />;

  const orgId = organization.data.id;

  const subscription = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscription.error) return <SubmissionFormNotAvailableUI />;

  const now = new Date();
  const dueDate = new Date(subscription.data.due_date);
  if (now > dueDate) return <SubmissionFormNotAvailableUI />;

  await supabase.from("view_logs").insert([{ form_id: form.data.id, org_id: orgId }]);

  const theme = await supabase.from("themes").select("*").eq("form_id", form.data.id).single();
  if (theme.error) return <SubmissionFormNotAvailableUI />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", form.data.id)
    .order("position", { ascending: true });
  if (blocks.error) return <SubmissionFormNotAvailableUI />;

  return (
    <SubmissionWrapper
      locale={locale}
      organization={organization.data}
      subscription={subscription.data}
      form={form.data}
      theme={theme.data}
      blocks={blocks.data}
    />
  );
};

export default S;
