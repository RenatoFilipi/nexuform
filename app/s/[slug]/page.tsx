import SubmissionWrapper from "@/components/s/submission-wrapper";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const form = await supabase
    .from("forms")
    .select("*")
    .eq("public_url", slug)
    .single();

  if (form.error) {
    return <NoFormAvailable />;
  }
  if (form.data.status !== "published") return <NoFormAvailable />;

  const formAnalytics = await supabase
    .from("forms_analytics")
    .select("id, total_views, total_submissions")
    .eq("form_id", form.data.id)
    .single();

  if (!formAnalytics.error) {
    const updatedTotalViews = formAnalytics.data.total_views + 1;
    const updatedCompletionRate =
      (formAnalytics.data.total_submissions / updatedTotalViews) * 100;

    await supabase
      .from("forms_analytics")
      .update({
        total_views: updatedTotalViews,
        avg_completion_rate: updatedCompletionRate,
      })
      .eq("id", formAnalytics.data.id);
  }

  const theme = await supabase
    .from("themes")
    .select("*")
    .eq("form_id", form.data.id)
    .single();

  if (theme.error) return <NoFormAvailable />;

  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", form.data.id)
    .order("position", { ascending: true });

  if (blocks.error) return <NoFormAvailable />;

  return (
    <SubmissionWrapper
      form={form.data}
      theme={theme.data}
      blocks={blocks.data}
    />
  );
};

const NoFormAvailable = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <span className="text-sm text-foreground/80">
          This form is not available or does not exist.
        </span>
        <div className="flex justify-center items-center w-full">
          <Button variant={"outline"} size={"xs"}>
            <Link href={"/"}>Go Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default S;
