"use client";

import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import FormShare from "@/components/private/forms/form-share";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateRelativeToNow } from "@/helpers/functions";
import { FormItemProps, FormSubmissionItemProps } from "@/helpers/interfaces";
import { appState } from "@/helpers/types";
import { formList, formSubmissionList } from "@/mocks/forms";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Form = () => {
  const [appState, setAppState] = useState<appState>("loading");
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
      setAppState("idle");
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex justify-between items-center">
        {form === undefined || form.title === "".trim() ? (
          <GenericLoader className="hidden sm:flex w-5 h-5" />
        ) : (
          <div className="hidden sm:flex">
            <h1 className="text-xl font-semibold">{form?.title}</h1>
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
      <div className="h-full border flex flex-col overflow-y-auto flex-1">
        {appState === "loading" && (
          <div className="flex justify-center items-center h-full flex-1">
            <GenericLoader className="w-8 h-8" />
          </div>
        )}
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
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {submissions.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="overflow-x-auto cursor-pointer">
                  <TableCell className="truncate text-foreground/80 text-xs p-3">
                    {sub.sender}
                  </TableCell>
                  <TableCell
                    className="truncate text-foreground/80 text-xs p-3"
                    suppressHydrationWarning>
                    {formatDateRelativeToNow(sub.submitted_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant={"outline"} size={"sm"}>
                      <Link href={`/dashboard/submission/${sub.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
