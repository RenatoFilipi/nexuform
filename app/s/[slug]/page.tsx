import {
  fetchBlocks,
  fetchForm,
  fetchOrganization,
  fetchSubscription,
  fetchTheme,
} from "@/app/actions/submission-actions";
import SubmissionFormNotAvailableUI from "@/components/public/submission/submission-form-not-available-ui";
import SubmissionWrapper from "@/components/public/submission/submission-wrapper";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();

  try {
    const form = await fetchForm(slug);
    const organization = await fetchOrganization(form.org_id);
    const subscription = await fetchSubscription(organization.id);
    const now = new Date();
    const dueDate = new Date(subscription.due_date);
    if (now > dueDate) throw new Error("No valid date.");
    await supabase.from("view_logs").insert([{ form_id: form.id, org_id: organization.id }]);
    const theme = await fetchTheme(form.id);
    const blocks = await fetchBlocks(form.id);

    return (
      <SubmissionWrapper
        locale={locale}
        organization={organization}
        subscription={subscription}
        form={form}
        theme={theme}
        blocks={blocks}
      />
    );
  } catch (error) {
    console.log(error);
    return <SubmissionFormNotAvailableUI />;
  }
};

export default S;
