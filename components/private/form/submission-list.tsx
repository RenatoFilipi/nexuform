"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { TsubmissionStatus } from "@/utils/types";

const SubmissionList = ({ submissions }: { submissions: ESubmission[] }) => {
  const BadgeVariation = (value: TsubmissionStatus) => {
    switch (value) {
      case "not_reviewed":
        return <Badge variant={"warning"}>Not Reviewed</Badge>;
      case "reviewed":
        return <Badge variant={"success"}>Reviewed</Badge>;
      case "ignored":
        return <Badge variant={"default"}>Not Reviewed</Badge>;
    }
  };

  if (submissions.length <= 0)
    return (
      <div className="flex justify-center items-center w-full flex-1">
        <div className="flex justify-center items-center h-full flex-1">
          <span className="text-foreground/80 uppercase text-xs">
            No submission to show
          </span>
        </div>
      </div>
    );

  return (
    <div className="flex w-full h-full flex-1 justify-start items-start">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Identifier</TableHead>
            <TableHead>Sent in</TableHead>
            <TableHead>Completion time</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="p-0 pl-4 py-2">{sub.sent_by}</TableCell>
                <TableCell className="py-2">
                  {formatDateRelativeToNow(sub.created_at)}
                </TableCell>
                <TableCell className="py-2">
                  {formatTime(sub.completion_time ?? 0)}
                </TableCell>
                <TableCell className="text-right py-2 pr-4">
                  {BadgeVariation(sub.status as TsubmissionStatus)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionList;
