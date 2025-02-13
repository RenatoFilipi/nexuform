"use client";

import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFormStore from "@/stores/form";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { TSubmissionStatus } from "@/utils/types";
import { SendIcon } from "lucide-react";
import SubmissionDetails from "./submission-details";

const FormSubmissions = () => {
  const { submissions, blocks } = useFormStore();

  return (
    <div className="flex flex-col w-full gap-4 overflow-y-auto">
      {submissions.length <= 0 && (
        <div className="w-full h-full flex-1 py-24">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex justify-center items-center p-2 rounded bg-primary/10">
              <SendIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-foreground font-semibold">
                No submission to show
              </span>
              <p className="text-sm text-muted-foreground">
                Your form hasn’t received any submissions yet.
              </p>
            </div>
          </div>
        </div>
      )}
      {submissions.length > 0 && (
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
                    {formatTime(submission.completion_time ?? 0, 2)}
                  </TableCell>
                  <TableCell className="py-2 pr-4">
                    <SubmissionStatusBadge
                      status={submission.status as TSubmissionStatus}
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
      )}
    </div>
  );
};

export default FormSubmissions;
