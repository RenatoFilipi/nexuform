import SubmissionStatus from "@/components/private2/form/submissions/submission-status";
import SubmissionStatusBadge from "@/components/private2/form/submissions/submission-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useUserStore from "@/stores/user";
import { minWidth640, minute } from "@/utils/constants";
import { EBlock, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TBlock, TSetState, TSubmissionStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { CalendarIcon, ClockIcon, DownloadIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Papa from "papaparse";
import { useState } from "react";
import { useMedia } from "react-use";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../../ui/drawer";
import ManageSubscription from "../../shared/subscription/manage-subscription";

interface IBlockItem {
  question: string;
  answer: string;
  type: TBlock;
}

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
  const user = useUserStore();
  const isAllowedToExport = user.subscription.plan === "pro";

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
          const formattedAnswer = new Intl.DateTimeFormat(user.locale).format(date);
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
    <div className="h-full flex flex-col gap-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-start items-center gap-4">
            <h2 className="text-xl font-bold text-foreground">{submission.identifier}</h2>
            <p className="text-sm text-muted-foreground">
              ({formatDateRelativeToNow(submission.created_at, user.locale)})
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmissionStatusBadge status={submission.status as TSubmissionStatus} />
            <Badge variant="primary" className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              {formatTime(submission.completion_time ?? 0, 2)}
            </Badge>
            <Badge variant="primary" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {new Date(submission.created_at).toLocaleString(user.locale)}
            </Badge>
          </div>
        </div>
      </div>
      {/* Answers Section */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {query.isLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoaderIcon className="h-6 w-6 animate-spin" />
          </div>
        ) : query.error ? (
          <div className="flex justify-center items-center h-32 text-destructive">{t("err_generic")}</div>
        ) : (
          query.data?.collections.map((coll, i) => <BlockItem key={i + 1} {...coll} />)
        )}
      </div>
      {/* Footer Actions */}
      <div className="space-y-3">
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
          <Button variant="outline" size={"sm"} onClick={() => setState(false)} className="w-full sm:w-auto">
            {t("label_close")}
          </Button>
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
            {isAllowedToExport ? (
              <Button
                onClick={() => exportOneSubmissionToCSV(submission, query.data?.collections ?? [])}
                variant="outline"
                size={"sm"}
                className="w-full sm:w-auto"
                disabled={!query.data}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                {t("label_csv_export")}
              </Button>
            ) : (
              <ManageSubscription>
                <Button variant="outline" className="w-full sm:w-auto" size={"sm"}>
                  {t("label_csv_export")}
                </Button>
              </ManageSubscription>
            )}
            <SubmissionStatus submission={submission} setState={setState} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlockItem = (props: IBlockItem) => {
  const t = useTranslations("app");

  const getBlockType = (type: TBlock): string => {
    switch (type) {
      case "short_text":
        return t("label_short_text");
      case "paragraph_text":
        return t("label_paragraph_text");
      case "checkboxes":
        return t("label_checkboxes");
      case "multiple_choice":
        return t("label_multiple_choice");
      case "dropdown_menu":
        return t("label_dropdown_menu");
      case "number_input":
        return t("label_number_input");
      case "email_address":
        return t("label_email_address");
      case "star_rating":
        return t("label_star_rating");
      case "custom_scale":
        return t("label_custom_scale");
      case "date_picker":
        return t("label_date_picker");
      default:
        return "--";
    }
  };
  return (
    <div className="space-y-2">
      <div className="font-medium text-foreground flex items-center gap-2 justify-start">
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm font-semibold">{props.question}</span>
        </div>
      </div>
      {props.answer.trim() !== "" ? (
        <div className="bg-foreground/5 rounded-sm p-2">
          <p className="text-xs whitespace-pre-wrap text-muted-foreground">{props.answer}</p>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">{t("label_no_answer")}</p>
        </div>
      )}
    </div>
  );
};
export default SubmissionDetails;
