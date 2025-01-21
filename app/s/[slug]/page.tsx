import SubmissionWrapper from "@/components/s/submission-wrapper";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const S = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const form = await supabase.from("forms").select("*").eq("id", slug).single();
  const theme = await supabase
    .from("themes")
    .select("*")
    .eq("form_id", slug)
    .single();
  const blocks = await supabase
    .from("blocks")
    .select("*")
    .eq("form_id", slug)
    .order("position", { ascending: true });

  if (
    form.error ||
    theme.error ||
    blocks.error ||
    form.data.status !== "published"
  ) {
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
  }

  return (
    <SubmissionWrapper
      form={form.data}
      theme={theme.data}
      blocks={blocks.data}
    />
  );
};

export default S;
