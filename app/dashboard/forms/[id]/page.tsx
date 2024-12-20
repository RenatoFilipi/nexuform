"use client";

import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import FormShare from "@/components/private/forms/form-share";
import FormSubmissionGroup from "@/components/private/forms/form-submission-group";
import { Button } from "@/components/ui/button";
import { mockForms, mockSubmissions } from "@/helpers/mocks";
import { FormProps, SubmissionProps } from "@/helpers/modules";
import { appState } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Form = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const pathname = usePathname();
  const formId = pathname.split("/")[3];
  const [submissions, setSubmissions] = useState<SubmissionProps[]>([]);
  const [form, setForm] = useState<FormProps | null>(null);

  useQuery({
    queryKey: ["formPageData"],
    queryFn: () => {
      const currentForm = mockForms.find((x) => x.id === formId);
      const currentSubmissions = mockSubmissions.filter(
        (x) => x.form_id === formId
      );
      if (!currentForm || !currentSubmissions) {
        setAppState("idle");
        return;
      }
      setForm(currentForm);
      setSubmissions(currentSubmissions);
      setAppState("idle");
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex justify-between items-center">
        {!form || form.name === "".trim() ? (
          <GenericLoader className="hidden sm:flex w-5 h-5" />
        ) : (
          <div className="hidden sm:flex">
            <h1 className="text-xl font-medium">{form.name}</h1>
          </div>
        )}
        <div className="flex justify-center items-center sm:gap-4 gap-2 w-full sm:w-fit">
          <FormShare formId={formId}>
            <Button variant={"outline"} size={"sm"} className="w-full">
              Share
            </Button>
          </FormShare>
          <Button variant={"default"} size={"sm"} className="w-full" asChild>
            <Link href={`/dashboard/editor/${formId}`}>Edit</Link>
          </Button>
        </div>
      </div>
      <div className="h-full flex flex-col overflow-y-auto flex-1">
        {appState === "loading" && (
          <div className="flex justify-center items-center h-full flex-1">
            <GenericLoader className="w-8 h-8" />
          </div>
        )}
        {appState === "idle" && submissions.length <= 0 && (
          <div className="flex justify-center items-center h-full flex-1 border rounded">
            <span className="text-foreground/80">No submissions to show.</span>
          </div>
        )}
        {appState === "idle" && submissions.length >= 1 && (
          <FormSubmissionGroup formId={formId} submissions={submissions} />
        )}
        {appState === "error" && (
          <div className="flex justify-center items-center h-full flex-1">
            <GenericError />
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
