"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import { EBlock, EForm, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
  BookIcon,
  ExternalLinkIcon,
  ForwardIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import FormShare from "../forms/form-share";
import SubmissionList from "./submission-list";

const FormWrapper = ({
  submissions,
  blocks,
  form,
}: {
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
}) => {
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
  const { setForm, setBlocks, setSubmissions } = useFormStore();

  useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      setForm(form);
      setBlocks(blocks);
      setSubmissions(submissions);
      return null;
    },
    refetchOnWindowFocus: false,
  });

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
            <FormShare
              publicUrl={form.public_url}
              status={form.status as TFormStatus}>
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
                  href={`/s/${form.public_url}`}
                  rel="noopener noreferrer"
                  className="flex justify-center items-center">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Go to Form
                </a>
              </Button>
            )}
            <Button variant={"default"} size={"sm"} className="w-full" asChild>
              <Link href={`/dashboard/editor/${form.id}`}>
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
        <SubmissionList />
      </div>
    </div>
  );
};

export default FormWrapper;
