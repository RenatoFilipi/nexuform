import SubmissionList from "@/components/private/form/submission-list";
import FormShare from "@/components/private/forms/form-share";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateRelativeToNow } from "@/utils/functions";
import { createClient } from "@/utils/supabase/server";
import { TFormStatus } from "@/utils/types";
import {
  BookIcon,
  ExternalLinkIcon,
  ForwardIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
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
    .select("name, status, updated_at")
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
    .eq("form_id", slug);

  const BadgeVariant = (status: TFormStatus) => {
    switch (status) {
      case "published":
        return (
          <Badge variant={"success"} uppercase>
            {status}
          </Badge>
        );
      case "draft":
        return (
          <Badge variant={"warning"} uppercase>
            {status}
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant={"default"} uppercase>
            {status}
          </Badge>
        );
    }
  };

  if (formError || submissionsError || blocksError) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
        <div className="flex flex-col justify-center items-center gap-2">
          <span className="">Something went wrong</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex flex-col">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="flex justify-between sm:justify-start items-center gap-3 w-full sm:w-fit">
            <div className="flex justify-center items-center gap-2">
              <BookIcon className="w-4 h-4" />
              <h1 className="font-medium truncate max-w-[240px]">
                {form.name}
              </h1>
            </div>
            {BadgeVariant(form.status as TFormStatus)}
          </div>
          <div className="flex justify-center items-center sm:gap-4 gap-2 w-full sm:w-fit">
            <FormShare formId={slug} status={form.status as TFormStatus}>
              <Button variant={"outline"} size={"sm"} className="w-full">
                <ForwardIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </FormShare>
            {form.status === "published" && (
              <Button
                variant={"outline"}
                size={"sm"}
                className="w-full sm:w-fit"
                asChild>
                <a
                  target="_blank"
                  href={`/s/${slug}`}
                  rel="noopener noreferrer"
                  className="flex justify-center items-center">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Go to Form
                </a>
              </Button>
            )}
            <Button variant={"default"} size={"sm"} className="w-full" asChild>
              <Link href={`/dashboard/editor/${slug}`}>
                <Settings2Icon className="w-4 h-4 mr-2" />
                Editor
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex">
          <span className="text-sm text-foreground/80">
            Form last updated {formatDateRelativeToNow(form.updated_at)}
          </span>
        </div>
      </div>
      <div className="flex justify-center flex-1 h-full">
        <SubmissionList submissions={submissions} blocks={blocks} />
      </div>
    </div>
  );
};

export default Form;
