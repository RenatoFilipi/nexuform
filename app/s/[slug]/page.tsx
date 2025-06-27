import SubmissionFormNotAvailableUI from "@/components/public/submission/submission-form-not-available-ui";
import SubmissionWrapper from "@/components/public/submission/submission-wrapper";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();

  const forms = await supabase.from("forms").select("*").eq("public_id", slug).single();
  if (forms.error || forms.data.status !== "published") return <SubmissionFormNotAvailableUI />;

  const organizations = await supabase.from("organizations").select("*").eq("id", forms.data.org_id).single();
  if (organizations.error) return <SubmissionFormNotAvailableUI />;

  const orgId = organizations.data.id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <SubmissionFormNotAvailableUI />;

  await supabase.from("view_logs").insert([{ form_id: forms.data.id, org_id: orgId }]);

  const themes = await supabase.from("themes").select("*").eq("form_id", forms.data.id).single();
  if (themes.error) return <SubmissionFormNotAvailableUI />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", forms.data.id)
    .order("position", { ascending: true });
  if (blocks.error) return <SubmissionFormNotAvailableUI />;

  return (
    <SubmissionWrapper
      locale={locale}
      organization={organizations.data}
      subscription={subscriptions.data}
      form={forms.data}
      theme={themes.data}
      blocks={blocks.data}
    />
  );
};

export default S;
