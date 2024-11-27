"use client";

import FormSubmissionView from "@/components/private/forms/form-submission-view";
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
import { minWidth640 } from "@/helpers/constants";
import { formatDateRelativeToNow } from "@/helpers/functions";
import { FormSubmissionItemProps } from "@/helpers/interfaces";
import { useMediaQuery } from "react-responsive";

const FormSubmissionGroup = ({
  submissions,
  formId,
}: {
  submissions: FormSubmissionItemProps[];
  formId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });

  const badgeDisplay = (reviewed: boolean) => {
    if (reviewed)
      return (
        <Badge variant={"success"} className="w-fit">
          Reviewed
        </Badge>
      );
    return (
      <Badge variant={"warning"} className="w-fit">
        Not Reviewed
      </Badge>
    );
  };

  if (isDesktop) {
    return (
      <Table className="overflow-y-auto border">
        <TableHeader>
          <TableRow>
            <TableHead>Submitted</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>State</TableHead>
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
              <TableCell className="">{sub.sender}</TableCell>
              <TableCell>{badgeDisplay(sub.reviewed)}</TableCell>
              <TableCell className="text-right">
                <FormSubmissionView
                  subId={sub.id}
                  formId={formId}
                  sender={sub.sender}
                  submitted_at={sub.submitted_at}
                  reviewed={sub.reviewed}>
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
    <div>
      {submissions.map((sub) => {
        return (
          <Card key={sub.id} className="p-3 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{sub.sender}</span>
              {badgeDisplay(sub.reviewed)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/80">
                {formatDateRelativeToNow(sub.submitted_at)}
              </span>
              <FormSubmissionView
                subId={sub.id}
                formId={formId}
                sender={sub.sender}
                submitted_at={sub.submitted_at}
                reviewed={sub.reviewed}>
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
