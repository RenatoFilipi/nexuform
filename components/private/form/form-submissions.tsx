"use client";

import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
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
import {
  formatDateRelativeToNow,
  formatDecimal,
  formatTime,
} from "@/utils/functions";
import { TSubmissionStatus } from "@/utils/types";
import { CheckCircleIcon, EyeIcon, SendIcon, TimerIcon } from "lucide-react";
import SubmissionDetails from "./submission-details";

const FormSubmissions = () => {
  const { submissions, blocks, formAnalytics } = useFormStore();

  const {
    total_submissions,
    total_views,
    avg_completion_rate,
    avg_completion_time,
  } = formAnalytics;

  const totalViews = total_views === 0 ? "--" : total_views.toString();

  const totalSubmissions =
    total_submissions === 0 ? "--" : total_submissions.toString();

  const averageCompletionRate =
    avg_completion_rate !== null
      ? `${formatDecimal(avg_completion_rate)}%`
      : "--";

  const averageCompletionTime =
    avg_completion_time !== null
      ? `${formatTime(avg_completion_time, 2)}`
      : "--";

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="sm:gap-6 gap-2 grid sm:grid-cols-4 grid-cols-2">
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Views</span>
          </div>
          <span className="text-sm">{totalViews}</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <SendIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm">Submissions</span>
          </div>
          <span className="text-sm">{totalSubmissions}</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Completion Rate</span>
          </div>
          <span className="text-sm">{averageCompletionRate}</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-red-500" />
            <span className="text-sm">Avg Completion Time</span>
          </div>
          <span className="text-sm">{averageCompletionTime}</span>
        </Card>
      </div>
      {submissions.length <= 0 && (
        <div className="w-full h-full flex-1 py-24">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex justify-center items-center p-2 rounded bg-primary/10">
              <SendIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-foreground/80 uppercase text-xs">
              No submission to show
            </span>
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
                    ({formatTime(submission.completion_time ?? 0, 2)})
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
