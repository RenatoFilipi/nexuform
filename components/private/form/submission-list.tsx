"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EBlock, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { TsubmissionStatus } from "@/utils/types";
import SubmissionDetails from "./submission-details";

const SubmissionList = ({
  submissions,
  blocks,
}: {
  submissions: ESubmission[];
  blocks: EBlock[];
}) => {
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission, index) => {
            return (
              <TableRow key={index} className="text-xs text-foreground/80">
                <TableCell className="p-0 pl-4 py-2 font-semibold">
                  {submission.identifier}
                </TableCell>
                <TableCell className="py-2">
                  <span className="">
                    {new Date(submission.created_at).toLocaleString()}
                  </span>
                  <span className="ml-2">
                    ({formatDateRelativeToNow(submission.created_at)})
                  </span>
                </TableCell>
                <TableCell className="py-2">
                  ({formatTime(submission.completion_time ?? 0, 2)})
                </TableCell>
                <TableCell className="py-2 pr-4">
                  {BadgeVariation(submission.status as TsubmissionStatus)}
                </TableCell>
                <TableCell className="text-right py-2 pr-4">
                  <SubmissionDetails blocks={blocks} submission={submission}>
                    <Button variant={"outline"} size={"xs"}>
                      View Details
                    </Button>
                  </SubmissionDetails>
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
