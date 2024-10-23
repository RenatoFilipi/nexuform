"use client";

import FormShare from "@/components/private/forms/form-share";
import FormSubmissionView from "@/components/private/forms/form-submission-view";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardFormState } from "@/helpers/types";
import { formList, formSubmissionList } from "@/mocks/forms";
import { BookIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Form = () => {
  const [state] = useState<dashboardFormState>("has_submissions");
  const pathname = usePathname();
  const currentFormId = pathname.split("/")[3];
  const currentForm = formList.find((x) => x.id === currentFormId);
  const submissions = formSubmissionList.filter(
    (x) => x.form_id === currentForm?.id
  );

  return (
    <div className="flex flex-col h-full gap-6 sm:gap-10 my-6 mx-3 sm:mx-12 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-2">
            <BookIcon className="w-5 h-5" />
            <span className="font-semibold">{currentForm?.title}</span>
          </div>
        </div>
        <div className="flex justify-center items-center sm:gap-4 gap-2">
          <FormShare id={currentFormId}>
            <Button variant={"outline"} size={"sm"}>
              Share
            </Button>
          </FormShare>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link href={`/dashboard/editor/${currentFormId}`}>Edit</Link>
          </Button>
        </div>
      </div>
      <div className="h-full border flex flex-col overflow-y-auto">
        <div className="border-b p-2">
          <span className="text-base">Submissions</span>
        </div>
        {/* loading */}
        {state === "loading" && (
          <div className="flex justify-center items-center h-full">
            <Loader2Icon className="w-6 h-6 animate-spin" />
          </div>
        )}
        {/* no submissions */}
        {state === "no_submissions" && (
          <div className="flex justify-center items-center h-full">
            <span className="text-foreground/80">No submissions to show.</span>
          </div>
        )}
        {/* has submissions */}
        {state === "has_submissions" && (
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
      </div>
    </div>
  );
};

export default Form;
