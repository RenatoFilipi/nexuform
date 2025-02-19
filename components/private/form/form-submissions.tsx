"use client";

import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFormStore from "@/stores/form";
import { minWidth640, paginationRange } from "@/utils/constants";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSubmissionStatus } from "@/utils/types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { default as FormSubmissionDetails, default as SubmissionDetails } from "./form-submission-details";

const FormSubmissions = () => {
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");
  const { submissions, blocks, setPagination, pagination, form, setSubmissions } = useFormStore();
  const isDesktop = useMedia(minWidth640);
  const disabledPrevious = appState === "loading" || pagination.from <= 0;
  const disabledNext = appState === "loading";
  const noSubmission = submissions.length <= 0;
  const records = submissions.length == 1 ? "1 record" : `${submissions.length} records`;

  const onPreviousData = async () => {
    setAppState("loading");
    const range = paginationRange;
    const from = pagination.from - range;
    const to = pagination.to - range;
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .range(from, to)
      .eq("form_id", form.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error on fetching submissions.");
      setAppState("idle");
      return;
    }

    setSubmissions(data);
    setPagination({ from, to });
    setAppState("idle");
  };
  const onNextData = async () => {
    setAppState("loading");
    const range = paginationRange;
    const from = pagination.from + range;
    const to = pagination.to + range;

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .range(from, to)
      .eq("form_id", form.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error on fetching submissions.");
      setAppState("idle");
      return;
    }

    setSubmissions(data);
    setPagination({ from, to });
    setAppState("idle");
  };

  return (
    <div className="flex flex-col w-full gap-4 overflow-y-auto">
      {isDesktop && (
        <div className="flex flex-col gap-4">
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
              {submissions.map((submission) => {
                return (
                  <TableRow key={submission.id} className="text-xs text-foreground/80">
                    <TableCell className="p-0 pl-4 py-2 font-semibold">{submission.identifier}</TableCell>
                    <TableCell className="py-2">
                      <span className="">{new Date(submission.created_at).toLocaleString()}</span>
                      <span className="ml-2">({formatDateRelativeToNow(submission.created_at)})</span>
                    </TableCell>
                    <TableCell className="py-2">{formatTime(submission.completion_time ?? 0, 2)}</TableCell>
                    <TableCell className="py-2 pr-4">
                      <SubmissionStatusBadge status={submission.status as TSubmissionStatus} />
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
          {noSubmission && (
            <div className="flex w-full justify-center items-center py-2">
              <span className="text-sm text-foreground/70">No submission to show.</span>
            </div>
          )}
          <div className="flex w-full justify-between items-center gap-4">
            <span className="text-xs text-foreground/80">{records}</span>
            <div className="flex justify-center items-center gap-4">
              <Button disabled={disabledPrevious} onClick={onPreviousData} variant={"outline"} size={"sm"}>
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button disabled={disabledNext} onClick={onNextData} variant={"outline"} size={"sm"}>
                Next
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isDesktop && (
        <div className="flex flex-col gap-2">
          {submissions.map((submission) => {
            return (
              <FormSubmissionDetails key={submission.id} blocks={blocks} submission={submission}>
                <Card className="flex flex-col border cursor-pointer p-2 gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">{submission.identifier}</span>
                    <SubmissionStatusBadge status={submission.status as TSubmissionStatus} />
                  </div>
                  <div className="text-xs text-foreground/70 flex justify-end">
                    <span className="">{new Date(submission.created_at).toLocaleString()}</span>
                    <span className="ml-2">({formatDateRelativeToNow(submission.created_at)})</span>
                  </div>
                </Card>
              </FormSubmissionDetails>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;
