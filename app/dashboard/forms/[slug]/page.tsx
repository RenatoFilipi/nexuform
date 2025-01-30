import FormWrapper from "@/components/private/form/form-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Form = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .eq("id", slug)
    .single();

  if (form === null) {
    return redirect("/dashboard/forms");
  }

  const { data: blocks, error: blocksError } = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", slug)
    .order("position", { ascending: true });

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select("*")
    .eq("form_id", slug)
    .order("created_at", { ascending: true });

  const { data: formAnalytics, error: formAnalyticsError } = await supabase
    .from("forms_analytics")
    .select("*")
    .eq("form_id", form.id)
    .single();

  if (formError || submissionsError || blocksError || formAnalyticsError) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
        <div className="flex flex-col justify-center items-center gap-2">
          <span className="">Something went wrong</span>
        </div>
      </div>
    );
  }

  return (
    <FormWrapper
      form={form}
      blocks={blocks}
      submissions={submissions}
      formAnalytics={formAnalytics}
    />
  );
};

export default Form;
