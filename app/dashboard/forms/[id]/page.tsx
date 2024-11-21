"use client";

import { FormItemProps } from "@/components/private/forms/form-item";
import FormShare from "@/components/private/forms/form-share";
import { FormSubmissionItemProps } from "@/components/private/forms/form-submission-item";
import FormSubmissionView from "@/components/private/forms/form-submission-view";
import GenericError from "@/components/private/shared/generic-error";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appState } from "@/helpers/types";
import { formList, formSubmissionList } from "@/mocks/forms";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Form = () => {
  const [appState] = useState<appState>("idle");
  const pathname = usePathname();
  const formId = pathname.split("/")[3];
  const [submissions, setSubmissions] = useState<FormSubmissionItemProps[]>([]);
  const [form, setForm] = useState<FormItemProps | undefined>();

  useQuery({
    queryKey: ["formPageData"],
    queryFn: () => {
      const currentForm = formList.find((x) => x.id === formId);
      setForm(currentForm);
      setSubmissions(
        formSubmissionList.filter((x) => x.form_id === currentForm?.id)
      );
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex justify-between items-center">
        <span className="font-semibold hidden sm:flex">{form?.title}</span>
        <div className="flex justify-center items-center sm:gap-4 gap-2 w-full sm:w-fit">
          <FormShare id={formId}>
            <Button variant={"outline"} size={"sm"} className="w-full">
              Share
            </Button>
          </FormShare>
          <Button variant={"default"} size={"sm"} className="w-full" asChild>
            <Link href={`/dashboard/editor/${formId}`}>Edit</Link>
          </Button>
        </div>
      </div>
      <div className="h-full border flex flex-col overflow-y-auto flex-1">
        {/* loading */}
        {appState === "loading" && (
          <div className="flex justify-center items-center h-full flex-1">
            <LoaderIcon className="w-8 h-8 animate-spin" />
          </div>
        )}
        {/* idle */}
        {appState === "idle" && submissions.length <= 0 && (
          <div className="flex justify-center items-center h-full flex-1">
            <span className="text-foreground/80">No submissions to show.</span>
          </div>
        )}
        {appState === "idle" && submissions.length >= 1 && (
          <Table className="overflow-y-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {submissions.map((sub) => (
                <FormSubmissionView key={sub.id}>
                  <TableRow className="overflow-x-auto cursor-pointer">
                    <TableCell className="truncate">{sub.email}</TableCell>
                    <TableCell
                      className="truncate text-right"
                      suppressHydrationWarning>
                      {sub.submitted_at}
                    </TableCell>
                  </TableRow>
                </FormSubmissionView>
              ))}
            </TableBody>
          </Table>
        )}
        {/* error */}
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
