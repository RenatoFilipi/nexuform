"use client";

import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
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
import useFormStore from "@/stores/form";
import { minWidth640 } from "@/utils/constants";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { TsubmissionStatus } from "@/utils/types";
import { useMedia } from "react-use";
import SubmissionDetails from "./submission-details";

const FormSubmissions = () => {
  const { submissions, blocks } = useFormStore();
  const isDesktop = useMedia(minWidth640);

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

  if (!isDesktop) {
    return (
      <div className="flex flex-col w-full gap-2">
        {submissions.map((submission, index) => {
          return (
            <SubmissionDetails
              key={index}
              submission={submission}
              blocks={blocks}>
              <Card className="border rounded p-2 cursor-pointer h-20 flex flex-col justify-between hover:bg-foreground/5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">
                    {submission.identifier}
                  </span>
                  <div className="flex justify-center items-center gap-2">
                    <Badge variant={"gray"}>
                      ({formatTime(submission.completion_time ?? 0, 2)})
                    </Badge>
                    <SubmissionStatusBadge
                      status={submission.status as TsubmissionStatus}
                    />
                  </div>
                </div>
                <div className="flex justify-start items-center text-xs gap-2">
                  <span className="">
                    {new Date(submission.created_at).toLocaleString()}
                  </span>
                  <span className="">
                    ({formatDateRelativeToNow(submission.created_at)})
                  </span>
                </div>
              </Card>
            </SubmissionDetails>
          );
        })}
      </div>
    );
  }

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
                  <SubmissionStatusBadge
                    status={submission.status as TsubmissionStatus}
                  />
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

export default FormSubmissions;
