import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUserStore from "@/stores/user";
import { minWidth640, minute } from "@/utils/constants";
import { EBlock, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TSetState, TSubmissionStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useState } from "react";
import { useMedia } from "react-use";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";
import ManageSubscription from "../shared/manage-subscription";
import FormSubmissionStatus from "./form-submission-status";

const FormSubmissionDetails = ({
  children,
  submission,
  blocks,
}: {
  children: React.ReactNode;
  submission: ESubmission;
  blocks: EBlock[];
}) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[600px] overflow-y-auto">
          <DialogHeader className="hidden">
            <div>
              <DialogTitle>Submission Details</DialogTitle>
              <DialogDescription>Review the questions and your responses from this submission.</DialogDescription>
            </div>
          </DialogHeader>
          <Body setState={setOpen} submission={submission} blocks={blocks} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 max-h-[90%]">
        <DrawerHeader className="hidden">
          <DrawerTitle>Details</DrawerTitle>
          <DrawerDescription>Review the questions and your responses from this submission.</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} submission={submission} blocks={blocks} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  submission,
  blocks,
}: {
  setState: TSetState<boolean>;
  submission: ESubmission;
  blocks: EBlock[];
}) => {
  const supabase = createClient();
  const { subscription } = useUserStore();
  const isDesktop = useMedia(minWidth640);
  const isAllowedToExport = subscription.plan === "pro";
  const query = useQuery({
    queryKey: [`submissionData`, submission.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("answers").select("*").eq("submission_id", submission.id);

      if (error) {
        throw new Error(`Error fetching answers: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned for submission.");
      }

      const collections = blocks.map((block) => {
        const targetAnswer = data.find((x) => x.block_id === block.id);
        if (!targetAnswer) return { question: block.name, answer: "" };
        return { question: block.name, answer: targetAnswer.value };
      });

      return { collections };
    },
    staleTime: 10 * minute,
    gcTime: 10 * minute,
    refetchOnWindowFocus: false,
  });

  const exportOneSubmissionToCSV = (submission: ESubmission, collection: { question: string; answer: string }[]) => {
    const csvData = [{ question: "Identifier", answer: submission.identifier }, ...collection];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const date = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];
    const fileName = `sub_${date}.csv`;
    saveAs(blob, fileName);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4">
      <div className="flex flex-col overflow-y-auto flex-1 gap-6">
        {isDesktop && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-start items-center gap-4">
              <span className="text-base font-medium">{submission.identifier}</span>
              <SubmissionStatusBadge status={submission.status as TSubmissionStatus} />
            </div>
            <div className="flex justify-start items-center gap-3 p-3 bg-[#F8F8F8] dark:bg-foreground/5 border rounded">
              <Badge variant={"info"}>{formatTime(submission.completion_time ?? 0, 2)}</Badge>
              <Badge variant={"info"}>{new Date(submission.created_at).toLocaleString()}</Badge>
              <Badge variant={"info"}>{formatDateRelativeToNow(submission.created_at)}</Badge>
            </div>
          </div>
        )}
        {!isDesktop && (
          <div className="flex flex-col gap-2 justify-center items-start mt-4">
            <span className="text-sm">{submission.identifier}</span>
            <div className="flex w-full justify-start items-center gap-2">
              <Badge variant={"info"}>{formatTime(submission.completion_time ?? 0, 2)}</Badge>
              <Badge variant={"info"}>{new Date(submission.created_at).toLocaleString()}</Badge>
              <Badge variant={"info"}>{formatDateRelativeToNow(submission.created_at)}</Badge>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-y-auto gap-6">
          {query.data?.collections.map((coll, i) => {
            return (
              <div key={i} className="flex flex-col">
                <span className="font-medium text-sm">{coll.question}</span>
                {coll.answer.trim() !== "" ? (
                  <span className="text-xs text-foreground/60">{coll.answer}</span>
                ) : (
                  <div className="flex justify-center items-center py-2 mt-2 border border-dashed">
                    <span className="text-xs text-foreground/80">No answer</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <Button variant={"outline"} size={"sm"} className="w-full sm:w-fit" onClick={() => setState(false)}>
          Close
        </Button>
        <div className="flex justify-center sm:justify-end items-center gap-3 w-full">
          {isAllowedToExport && (
            <Button
              onClick={() => {
                exportOneSubmissionToCSV(submission, query.data?.collections ?? []);
              }}
              variant={"outline"}
              size={"sm"}
              className="w-full sm:w-fit">
              Export as CSV
            </Button>
          )}
          {!isAllowedToExport && (
            <ManageSubscription>
              <Button variant={"outline"} size={"sm"} className="w-full sm:w-fit">
                Export as CSV
              </Button>
            </ManageSubscription>
          )}
          <FormSubmissionStatus submission={submission} setState={setState} />
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionDetails;
