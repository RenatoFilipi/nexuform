"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { mockAnswers, mockBlocks, mockSubmissions } from "@/helpers/mocks";
import { SubmissionModel } from "@/helpers/models";
import { SubmissionSegmentProps } from "@/helpers/modules";
import { appState, setState, submissionStatus } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const FormSubmissionView = ({
  children,
  subId,
  formId,
}: {
  children: React.ReactNode;
  subId: string;
  formId: string;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[600px]">
          <Body setState={setOpen} subId={subId} formId={formId} />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body setState={setOpen} subId={subId} formId={formId} />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  subId,
  formId,
}: {
  setState: setState<boolean>;
  subId: string;
  formId: string;
}) => {
  const [appState, setAppState] = useState<appState>("idle");
  const [segments, setSegments] = useState<SubmissionSegmentProps[]>([]);
  const [submission, setSubmission] = useState<SubmissionModel>({
    id: "",
    form_id: "",
    sender: "",
    status: "not_reviewed",
    submitted_at: "",
  });

  useQuery({
    queryKey: ["formSubmissionView"],
    queryFn: () => {
      const sub = mockSubmissions.find((x) => x.id === subId);
      const answers = mockAnswers.filter((x) => x.submission_id === subId);
      const blocks = mockBlocks.filter((x) => x.form_id === formId);

      if (!sub) {
        setAppState("idle");
        return;
      }

      const seg = blocks.map((b) => {
        const answer = answers.find((x) => x.block_id === b.id)?.answer ?? "";
        return { question: b.name, answer };
      });

      setSegments(seg);
      setSubmission(sub);
      return null;
    },
    refetchOnWindowFocus: false,
  });

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
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col justify-center items-start gap-2">
          <span className="font-semibold text-lg">{submission.sender}</span>
          {statusDisplay(submission.status)}
        </div>
      </div>
      <div className="flex flex-col h-full gap-4">
        {segments.map((seg, index) => {
          return (
            <div key={index} className="flex flex-col gap-1">
              <h1 className="font-semibold text-sm">{seg.question}</h1>
              <p className="text-xs text-foreground/60">{seg.answer}</p>
            </div>
          );
        })}
      </div>
      <div className="flex sm:justify-end justify-center items-center gap-4 flex-col-reverse sm:flex-row">
        <Button
          onClick={() => setState(false)}
          variant={"outline"}
          size={"sm"}
          className="w-full sm:w-fit">
          Close
        </Button>
        <Button
          onClick={() => setState(false)}
          variant={"default"}
          size={"sm"}
          className="w-full sm:w-fit">
          Mark as Reviewed
        </Button>
      </div>
    </div>
  );
};

export default FormSubmissionView;
