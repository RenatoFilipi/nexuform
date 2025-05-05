"use client";

import SubmissionStatusBadge from "@/components/shared/badges/submission-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { minWidth640, paginationRange } from "@/utils/constants";
import { ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSubmissionStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon, SendIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { default as FormSubmissionDetails, default as SubmissionDetails } from "./form-submission-details";

const FormSubmissions = () => {
  const t = useTranslations("app");
  const statusButtons = [
    { label: t("label_all"), status: "all", icon: <div className="h-2 w-2 rounded-full bg-foreground"></div> },
    { label: t("label_reviewed"), status: "reviewed", icon: <div className="h-2 w-2 rounded-full bg-success"></div> },
    {
      label: t("label_not_reviewed"),
      status: "not_reviewed",
      icon: <div className="h-2 w-2 rounded-full bg-warning"></div>,
    },
    { label: t("label_ignored"), status: "ignored", icon: <div className="h-2 w-2 rounded-full bg-gray-500"></div> },
  ];
  const supabase = createClient();
  const isDesktop = useMedia(minWidth640);
  const { locale } = useUserStore();
  const global = useGlobalStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [filterStatus, setFilterStatus] = useState("all");
  const [ls, setSl] = useState<ESubmission[]>(global.submissions);
  const disabledPrevious = appState === "loading" || global.submissionPagination.from <= 0;
  const disabledNext = appState === "loading" || global.submissions.length <= paginationRange;
  const noSubmission = global.submissions.length <= 0;

  const onPreviousData = async () => {
    setAppState("loading");
    const range = paginationRange;
    const from = global.submissionPagination.from - range;
    const to = global.submissionPagination.to - range;

    const submissions = await supabase
      .from("submissions")
      .select("*")
      .range(from, to)
      .eq("form_id", global.form.id)
      .order("created_at", { ascending: false });

    if (submissions.error) {
      toast.error(t("err_fetch_submissions"));
      setAppState("idle");
      return;
    }
    global.setSubmissions(submissions.data);
    global.setSubmissionPagination({ from, to });
    setAppState("idle");
  };
  const onNextData = async () => {
    setAppState("loading");
    const range = paginationRange;
    const from = global.submissionPagination.from + range;
    const to = global.submissionPagination.to + range;

    const submissions = await supabase
      .from("submissions")
      .select("*")
      .range(from, to)
      .eq("form_id", global.form.id)
      .order("created_at", { ascending: false });

    if (submissions.error) {
      toast.error(t("err_fetch_submissions"));
      setAppState("idle");
      return;
    }

    global.setSubmissions(submissions.data);
    global.setSubmissionPagination({ from, to });
    setAppState("idle");
  };
  const onFilter = (value: string) => {
    setFilterStatus(value);
  };
  useQuery({
    queryKey: [filterStatus, global.submissions],
    queryFn: () => {
      if (filterStatus === "all") {
        setSl(global.submissions);
        return null;
      }
      const fs = global.submissions.filter((x) => x.status === filterStatus);
      setSl(fs);
      return null;
    },
  });

  return (
    <div className="flex flex-col w-full gap-4 overflow-y-auto">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4 w-full">
        <div className="flex justify-start items-center gap-2 w-full overflow-x-auto">
          {statusButtons.map((x) => {
            return (
              <Button
                key={x.status}
                variant={"outline"}
                size={"xs"}
                className={`${
                  filterStatus === x.status ? "bg-foreground/5" : ""
                } flex justify-center items-center gap-2 w-full sm:w-fit`}
                onClick={() => onFilter(x.status)}>
                {x.icon}
                {x.label}
              </Button>
            );
          })}
        </div>
        <div className="flex justify-end items-center gap-4">
          {filterStatus !== "all" && (
            <Badge variant={"purple"}>
              <FilterIcon className="w-4 h-4 mr-2" /> <span className="truncate">{t("label_filter_applied")}</span>
              <button onClick={() => setFilterStatus("all")} className="ml-2 w-fit hover:bg-purple-500/20 rounded">
                <XIcon className="w-4 h-4" />
              </button>
            </Badge>
          )}
        </div>
      </div>
      {isDesktop && (
        <div className="flex flex-col gap-4">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>{t("col_identifier")}</TableHead>
                <TableHead>{t("col_status")}</TableHead>
                <TableHead>{t("col_sent_in")}</TableHead>
                <TableHead>{t("col_completion_time")}</TableHead>
                <TableHead className="text-right">{t("col_actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ls.map((submission) => {
                return (
                  <TableRow key={submission.id} className="text-xs text-foreground/80">
                    <TableCell className="p-0 pl-4 py-2 font-semibold">{submission.identifier}</TableCell>
                    <TableCell className="py-2">
                      <SubmissionStatusBadge status={submission.status as TSubmissionStatus} />
                    </TableCell>
                    <TableCell className="py-2">
                      <span className="">{new Date(submission.created_at).toLocaleString()}</span>
                      <span className="ml-2">({formatDateRelativeToNow(submission.created_at, locale)})</span>
                    </TableCell>
                    <TableCell className="py-2">{formatTime(submission.completion_time ?? 0, 2)}</TableCell>
                    <TableCell className="text-right py-2  ">
                      <SubmissionDetails blocks={global.blocks} submission={submission}>
                        <Button variant={"outline"} size={"xs"} className="">
                          <ArrowUpRightIcon className="w-4 h-4" />
                        </Button>
                      </SubmissionDetails>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {noSubmission && (
            <div className="flex w-full justify-center items-center flex-col gap-4 py-20">
              <div className="flex justify-center items-center p-2 w-fit rounded bg-foreground/5">
                <SendIcon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{t("label_no_submission")}</span>
            </div>
          )}
          {!noSubmission && (
            <div className="flex w-full justify-end items-center gap-4">
              <div className="flex justify-center items-center gap-4">
                <Button disabled={disabledPrevious} onClick={onPreviousData} variant={"outline"} size={"sm"}>
                  <ChevronLeftIcon className="w-4 h-4 mr-2" />
                  {t("label_previous")}
                </Button>
                <Button disabled={disabledNext} onClick={onNextData} variant={"outline"} size={"sm"}>
                  {t("label_next")}
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {!isDesktop && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {ls.map((submission) => {
              return (
                <FormSubmissionDetails key={submission.id} blocks={global.blocks} submission={submission}>
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
          {noSubmission && (
            <div className="flex w-full justify-center items-center flex-col gap-4 py-2">
              <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
                <SendIcon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{t("label_no_submission")}</span>
            </div>
          )}
          {!noSubmission && (
            <div className="flex w-full justify-center items-center gap-4">
              <div className="flex justify-center items-center gap-4 w-full">
                <Button
                  disabled={disabledPrevious}
                  onClick={onPreviousData}
                  variant={"outline"}
                  size={"sm"}
                  className="w-full">
                  <ChevronLeftIcon className="w-4 h-4 mr-2" />
                  {t("label_previous")}
                </Button>
                <Button disabled={disabledNext} onClick={onNextData} variant={"outline"} size={"sm"} className="w-full">
                  {t("label_next")}
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;
