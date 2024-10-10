"use client";

import FormSubmissionView from "@/components/private/forms/form-submission-view";
import { Badge2 } from "@/components/ui/badge2";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formList, formSubmissionList } from "@/mocks/forms";
import { BookIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type state = "loading" | "no_submissions" | "has_submissions" | "error";

const Form = () => {
  const [state] = useState<state>("has_submissions");
  const pathname = usePathname();
  const currentFormId = pathname.split("/")[3];
  const currentForm = formList.find((x) => x.id === currentFormId);
  const submissions = formSubmissionList.filter(
    (x) => x.form_id === currentForm?.id
  );

  return (
    <div className="flex flex-col h-full gap-6 sm:gap-10 my-6 mx-3 sm:mx-12 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4 sm:gap-8">
          <div className="flex justify-center items-center gap-2">
            <BookIcon className="w-5 h-5" />
            <span className="font-semibold">{currentForm?.title}</span>
          </div>
          <Badge2>{currentForm?.status}</Badge2>
        </div>
        <Button variant={"secondary"} size={"sm"} asChild>
          <Link href={`/dashboard/editor/${currentFormId}`}>Edit Form</Link>
        </Button>
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
