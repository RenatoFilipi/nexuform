import SubmissionList from "@/components/private/form/submission-list";
import FormShare from "@/components/private/forms/form-share";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ExternalLinkIcon, ForwardIcon, Settings2Icon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Form = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }
  const { data: form } = await supabase
    .from("forms")
    .select("name")
    .eq("owner_id", data.user.id)
    .eq("id", slug)
    .single();

  if (form === null) {
    return redirect("/dashboard/forms");
  }

  const { data: submissions } = await supabase.from("submissions").select("*").eq("form_id", slug);

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex justify-between items-center">
        <div className="hidden sm:flex">
          <h1 className="text-xl font-medium">{form.name}</h1>
        </div>
        <div className="flex justify-center items-center sm:gap-4 gap-2 w-full sm:w-fit">
          <FormShare formId={slug}>
            <Button variant={"outline"} size={"sm"} className="w-full">
              <ForwardIcon className="w-4 h-4 mr-2" />
              Share
            </Button>
          </FormShare>
          <Button variant={"outline"} size={"sm"} className="w-full sm:w-fit" asChild>
            <Link href={`/s/${slug}`} className="flex justify-center items-center">
              <ExternalLinkIcon className="w-4 h-4 mr-2" />
              Go to Form
            </Link>
          </Button>
          <Button variant={"default"} size={"sm"} className="w-full" asChild>
            <Link href={`/dashboard/editor/${slug}`}>
              <Settings2Icon className="w-4 h-4 mr-2" /> Editor
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center flex-1 h-full">
        <SubmissionList submissions={submissions ?? []} />
      </div>
    </div>
  );
};

export default Form;
