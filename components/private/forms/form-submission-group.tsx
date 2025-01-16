"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { minWidth640 } from "@/utils/constants";
import { formatDateRelativeToNow } from "@/utils/functions";
import { SubmissionProps } from "@/utils/modules";
import { submissionStatus } from "@/utils/types";
import { useMedia } from "react-use";
import FormSubmissionView from "./form-submission-view";

const FormSubmissionGroup = ({
  submissions,
  formId,
}: {
  submissions: SubmissionProps[];
  formId: string;
}) => {
  const isDesktop = useMedia(minWidth640);

  const statusDisplay = (value: submissionStatus) => {
    switch (value) {
      case "reviewed":
        return (
          <Badge variant={"success"} className="w-fit">
            Reviewed
          </Badge>
        );
      case "not_reviewed":
        return (
          <Badge variant={"warning"} className="w-fit">
            Not Reviewed
          </Badge>
        );
      case "ignored":
        return (
          <Badge variant={"destructive"} className="w-fit">
            Ignored
          </Badge>
        );
      default:
        return <></>;
    }
  };

  if (isDesktop) {
    return (
      <Table className="overflow-y-auto border">
        <TableHeader>
          <TableRow>
            <TableHead>Submitted</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {submissions.map((sub) => (
            <TableRow key={sub.id} className="overflow-x-auto cursor-pointer">
              <TableCell
                className="truncate text-foreground/80 text-xs p-3"
                suppressHydrationWarning>
                {formatDateRelativeToNow(sub.submitted_at)}
              </TableCell>
              <TableCell className="p-3">{sub.sender}</TableCell>
              <TableCell className="p-3">{statusDisplay(sub.status)}</TableCell>
              <TableCell className="text-right p-3">
                <FormSubmissionView subId={sub.id} formId={formId}>
                  <Button variant={"outline"} size={"sm"}>
                    View Details
                  </Button>
                </FormSubmissionView>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="">
      {submissions.map((sub) => {
        return (
          <Card key={sub.id} className="p-3 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">{sub.sender}</span>
              {statusDisplay(sub.status)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/80">
                {formatDateRelativeToNow(sub.submitted_at)}
              </span>
              <FormSubmissionView subId={sub.id} formId={formId}>
                <Button variant={"outline"} size={"sm"}>
                  View Details
                </Button>
              </FormSubmissionView>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FormSubmissionGroup;
