"use client";

import GenericLoader from "@/components/core/generic-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { minWidth640 } from "@/helpers/constants";
import { formatDateRelativeToNow } from "@/helpers/functions";
import { AnswerProps } from "@/helpers/interfaces";
import { mockSubmissions } from "@/helpers/mocks";
import { appState, setState, submissionStatus } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Drawer, DrawerContent, DrawerTrigger } from "../../ui/drawer";

const FormSubmissionView = ({
  children,
  subId,
  sender,
  formId,
  submitted_at,
  status,
}: {
  children: React.ReactNode;
  subId: string;
  formId: string;
  sender: string;
  submitted_at: string;
  status: submissionStatus;
}) => {
  const isDesktop = useMediaQuery({ query: minWidth640 });
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="min-w-[600px]">
          <Body
            setState={setOpen}
            subId={subId}
            sender={sender}
            formId={formId}
            submitted_at={submitted_at}
            status={status}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 h-[90%]">
        <Body
          setState={setOpen}
          subId={subId}
          sender={sender}
          formId={formId}
          submitted_at={submitted_at}
          status={status}
        />
      </DrawerContent>
    </Drawer>
  );
};

const Body = ({
  setState,
  subId,
  formId,
  sender,
  submitted_at,
  status,
}: {
  setState: setState<boolean>;
  subId: string;
  formId: string;
  sender: string;
  submitted_at: string;
  status: submissionStatus;
}) => {
  const [appState, setAppState] = useState<appState>("loading");
  const [blocks, setBlocks] = useState<AnswerProps[]>([]);

  useQuery({
    queryKey: ["formSubmissionView", subId],
    queryFn: () => {
      const sub = mockSubmissions.find((x) => x.id === subId);

      if (!sub) {
        setAppState("idle");
        return null;
      }
      setAppState("idle");
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
      <div className="flex flex-col gap-2">
        <div className="pt-4 sm:pt-0 flex justify-center sm:justify-start items-center text-sm gap-0 sm:gap-2 flex-col sm:flex-row">
          <span className="font-semibold text-xl">{sender}</span>
          <span className="text-foreground/80 text-xs">
            ({formatDateRelativeToNow(submitted_at)})
          </span>
        </div>
        <div className="flex justify-center sm:justify-start w-full items-center gap-2">
          {statusDisplay(status)}
        </div>
      </div>
      {appState === "loading" && (
        <div className="flex justify-center items-center h-full">
          <GenericLoader className="w-8 h-8" />
        </div>
      )}
      {appState === "idle" && blocks.length <= 0 && (
        <div className="h-full flex overflow-y-auto justify-center items-center">
          <span className="text-sm text-foreground/80">
            No details to review.
          </span>
        </div>
      )}
      {appState === "idle" && blocks.length >= 1 && (
        <div className="h-full flex flex-col gap-4 mt-2 overflow-y-auto">
          {blocks.map((block, i) => {
            return (
              <div key={i} className="flex flex-col gap-3">
                <p className="text-sm font-medium">{block.name}</p>
                {block.answer === "".trim() ? (
                  <Card className="flex justify-center items-center py-3">
                    <span className="text-xs text-foreground/60">
                      No Answer
                    </span>
                  </Card>
                ) : (
                  <p className="text-xs text-foreground/50">{block.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
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
          variant={"secondary"}
          size={"sm"}
          className="w-full sm:w-fit">
          Mark as Reviewed
        </Button>
      </div>
    </div>
  );
};

export default FormSubmissionView;
