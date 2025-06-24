import FormNotAvailableUI from "@/components/private/shared/form/form-not-available-ui";
import { createClient } from "@/utils/supabase/server";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();

  const forms = await supabase.from("forms").select("*").eq("public_id", slug).single();
  if (forms.error || forms.data.status !== "published") return <FormNotAvailableUI />;

  const organizations = await supabase.from("organizations").select("*").eq("id", forms.data.org_id).single();
  if (organizations.error) return <FormNotAvailableUI />;

  const orgId = organizations.data.id;

  const subscriptions = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single();
  if (subscriptions.error) return <FormNotAvailableUI />;

  await supabase.from("view_logs").insert([{ form_id: forms.data.id, org_id: orgId }]);

  return <div>all good</div>;
};

export default S;
