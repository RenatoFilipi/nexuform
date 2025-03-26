import SubmissionStatusBadge from "@/components/shared/submission-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useUserStore from "@/stores/user";
import { minWidth640, minute } from "@/utils/constants";
import { EBlock, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TBlock, TSetState, TSubmissionStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex flex-col min-w-[650px] overflow-y-auto">
          <SheetHeader className="hidden">
            <div>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
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
      <DrawerContent className="p-3 max-h-[90%] h-full">
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
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
  const t = useTranslations("app");
  const supabase = createClient();
  const { subscription, locale } = useUserStore();
  const isDesktop = useMedia(minWidth640);
  const isAllowedToExport = subscription.plan === "pro";

  const query = useQuery({
    queryKey: [`submissionData`, submission.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("answers").select("*").eq("submission_id", submission.id);
      if (error) {
        throw new Error(t("err_generic"));
      }
      const collections = blocks.map((block) => {
        const targetAnswer = data.find((x) => x.block_id === block.id);
        if (!targetAnswer) return { question: block.name, answer: "", type: block.type as TBlock };

        if (block.type === "date_picker") {
          const date = new Date(targetAnswer.value);
          const formattedAnswer = new Intl.DateTimeFormat(locale).format(date);
          return { question: block.name, answer: formattedAnswer, type: block.type as TBlock };
        }
        return { question: block.name, answer: targetAnswer.value, type: block.type as TBlock };
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
      <div className="flex flex-col overflow-y-auto flex-1 gap-4">
        {isDesktop && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-base font-medium">{submission.identifier}</span>
              <SubmissionStatusBadge status={submission.status as TSubmissionStatus} uppercase />
            </div>
            <div className="flex justify-start items-center gap-3">
              <Badge variant={"info"}>{formatTime(submission.completion_time ?? 0, 2)}</Badge>
              <Badge variant={"info"}>{new Date(submission.created_at).toLocaleString()}</Badge>
              <Badge variant={"info"}>{formatDateRelativeToNow(submission.created_at, locale)}</Badge>
            </div>
          </div>
        )}
        {!isDesktop && (
          <div className="flex flex-col gap-2 justify-center items-start mt-4">
            <div className="flex justify-center items-start w-full flex-col gap-2">
              <span className="text-sm">{submission.identifier}</span>
              <SubmissionStatusBadge status={submission.status as TSubmissionStatus} uppercase />
            </div>
            <div className="flex w-full justify-start items-center gap-2">
              <Badge variant={"info"}>{formatTime(submission.completion_time ?? 0, 2)}</Badge>
              <Badge variant={"info"}>{new Date(submission.created_at).toLocaleString()}</Badge>
              <Badge variant={"info"}>{formatDateRelativeToNow(submission.created_at)}</Badge>
            </div>
          </div>
        )}
        <Separator />
        <div className="flex-1 flex flex-col overflow-y-auto gap-6">
          {query.data?.collections.map((coll, i) => {
            const { question, answer, type } = coll;
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-start items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{question}</span>
                </div>
                {answer.trim() !== "" ? (
                  <span className="text-xs text-foreground/70">{answer}</span>
                ) : (
                  <div className="flex justify-center items-center py-2 mt-2 border border-dashed">
                    <span className="text-xs text-foreground/80">{t("label_no_answer")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center flex-col-reverse sm:flex-row gap-4">
        <Button variant={"outline"} size={"sm"} className="w-full sm:w-fit" onClick={() => setState(false)}>
          {t("label_close")}
        </Button>
        <div className="flex justify-center sm:justify-end items-center gap-3 w-full flex-col-reverse sm:flex-row">
          {isAllowedToExport && (
            <Button
              onClick={() => {
                exportOneSubmissionToCSV(submission, query.data?.collections ?? []);
              }}
              variant={"secondary"}
              size={"sm"}
              className="w-full sm:w-fit">
              {t("label_csv_export")}
            </Button>
          )}
          {!isAllowedToExport && (
            <ManageSubscription>
              <Button variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
                {t("label_csv_export")}
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
