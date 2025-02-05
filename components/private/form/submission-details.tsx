import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { minWidth640, minute } from "@/utils/constants";
import { EBlock, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TSetState, TSubmissionStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMedia } from "react-use";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import SubmissionStatus from "./submission-status";

const SubmissionDetails = ({
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[550px] gap-3">
          <SheetHeader>
            <div>
              <SheetTitle>Submission Details</SheetTitle>
              <SheetDescription>
                Review the questions and your responses from this submission.
              </SheetDescription>
            </div>
          </SheetHeader>
          <Body setState={setOpen} submission={submission} blocks={blocks} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <DrawerHeader>
          <DrawerTitle>Details</DrawerTitle>
          <DrawerDescription>
            Review the questions and your responses from this submission.
          </DrawerDescription>
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
  const query = useQuery({
    queryKey: [`submissionData`, submission.id],
    queryFn: async () => {
      console.log("submission-" + submission.id);
      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("submission_id", submission.id);

      if (error) {
        throw new Error(`Error fetching answers: ${error.message}`);
      }

      if (!data) {
        throw new Error("No data returned for submission.");
      }

      const collections = blocks.map((block) => {
        const targetAnswer = data.find((x) => x.block_id === block.id);
        if (!targetAnswer) return { name: block.name, answer: "" };
        return { name: block.name, answer: targetAnswer.value };
      });

      return { collections };
    },
    staleTime: 10 * minute,
    gcTime: 10 * minute,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4">
      <div className="flex flex-col overflow-y-auto flex-1 gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm">{submission.identifier}</span>
          <div className="flex justify-start items-center gap-3">
            <SubmissionStatusBadge
              status={submission.status as TSubmissionStatus}
            />
            <Badge variant={"info"}>
              {formatTime(submission.completion_time ?? 0, 2)}
            </Badge>
            <Badge variant={"info"}>
              {new Date(submission.created_at).toLocaleString()}
            </Badge>
            <Badge variant={"info"}>
              {formatDateRelativeToNow(submission.created_at)}
            </Badge>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto gap-4">
          {query.data?.collections.map((coll, i) => {
            return (
              <div key={i} className="flex flex-col">
                <span className="font-semibold text-sm">{coll.name}</span>
                {coll.answer.trim() !== "" ? (
                  <span className="text-xs text-foreground/80">
                    {coll.answer}
                  </span>
                ) : (
                  <div className="flex justify-center items-center py-2 mt-2 border border-dashed">
                    <span className="text-xs text-foreground/80">
                      No answer to this question
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button variant={"outline"} size={"sm"} onClick={() => setState(false)}>
          Cancel
        </Button>
        <div className="flex justify-center items-center gap-3">
          <Button variant={"secondary"} size={"sm"}>
            Export as CSV
          </Button>
          <SubmissionStatus submission={submission} setState={setState} />
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
