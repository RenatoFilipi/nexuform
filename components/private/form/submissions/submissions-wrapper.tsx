"use client";

import SubmissionStatusBadge from "@/components/private/form/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { paginationFrom, paginationRange, paginationTo } from "@/utils/constants";
import {
  EBlock,
  EForm,
  EOrganization,
  EProfile,
  ESubmission,
  ESubscription,
  ETeamMemberProfile,
} from "@/utils/entities";
import { formatDateRelativeToNow, formatTime } from "@/utils/functions";
import { IContext, IPagination } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TSubmissionStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import SubmissionDetails from "./submission-details";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  submissions: ESubmission[];
  blocks: EBlock[];
  context: IContext;
}

const SubmissionsWrapper = (props: IProps) => {
  const user = useUserStore();
  const app = useAppStore();

  const query = useQuery({
    queryKey: ["submissions-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForm(props.form);
      app.setBlocks(props.blocks);
      app.setSubmissions(props.submissions);
      app.setContext(props.context);
      return null;
    },
  });
  const noSubmission = app.submissions.length <= 0;
  if (query.isPending) return null;

  if (noSubmission) return <SubmissionsNoData />;
  return <SubmissionsList />;
};

const SubmissionsNoData = () => {
  const t = useTranslations("app");

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-start sm:items-center">
        <span className="font-semibold text-lg sm:text-xl">{t("label_submissions")}</span>
      </div>
      <Card className="flex w-full justify-center items-center flex-col gap-4 py-36 px-4">
        <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
          <SendIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col justify-center items-center gap-1 text-center">
          <h3 className="text-xl font-bold text-foreground">{t("label_no_submission")}</h3>
          <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("label_desc_no_submission")}</p>
        </div>
      </Card>
    </div>
  );
};
const SubmissionsList = () => {
  const t = useTranslations("app");
  const supabase = createClient();
  const user = useUserStore();
  const app = useAppStore();
  const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
  const [pagination, setPagination] = useState<IPagination>({ from: paginationFrom, to: paginationTo });
  const statusButtons = [
    {
      label: t("label_all"),
      status: "all",
      icon: <div className="h-2 w-2 rounded-full bg-foreground"></div>,
      enabled: true,
    },
    {
      label: t("label_reviewed"),
      status: "reviewed",
      icon: <div className="h-2 w-2 rounded-full bg-success"></div>,
      enabled: true,
    },
    {
      label: t("label_not_reviewed"),
      status: "not_reviewed",
      icon: <div className="h-2 w-2 rounded-full bg-warning"></div>,
      enabled: true,
    },
    {
      label: t("label_ignored"),
      status: "ignored",
      icon: <div className="h-2 w-2 rounded-full bg-gray-400"></div>,
      enabled: false,
    },
  ];
  const filteredSubmissions = app.submissions.filter((submission) => {
    if (status === "all") return true;
    return submission.status === status;
  });
  const fetchSubmissions = async (newPagination = pagination) => {
    let submissions = await supabase
      .from("submissions")
      .select("*")
      .eq("form_id", app.form.id)
      .order("created_at", { ascending: false })
      .range(newPagination.from, newPagination.to);

    if (submissions.error) {
      toast.error(t("err_generic"));
      return;
    }

    app.setSubmissions(submissions.data);
  };
  const handleNext = async () => {
    const nextFrom = pagination.from + paginationRange + 1;
    const nextTo = pagination.to + paginationRange + 1;
    const newPagination = { from: nextFrom, to: nextTo };
    setPagination(newPagination);
    await fetchSubmissions(newPagination);
  };
  const handleBack = async () => {
    const prevFrom = pagination.from - paginationRange - 1;
    const prevTo = pagination.to - paginationRange - 1;
    const newPagination = { from: prevFrom, to: prevTo };
    setPagination(newPagination);
    await fetchSubmissions(newPagination);
  };
  const disabledNext = app.submissions.length <= paginationRange;
  const disableBack = pagination.from <= 0;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-start sm:items-center">
        <span className="font-semibold text-lg sm:text-xl">{t("label_submissions")}</span>
        <div className="flex w-full sm:w-fit justify-start overflow-x-auto">
          <div className="flex justify-center items-center gap-2">
            {statusButtons
              .filter((s) => s.enabled)
              .map((x) => {
                return (
                  <Button
                    key={x.status}
                    variant={"outline"}
                    size={"sm"}
                    className={`${
                      status === x.status ? "bg-foreground/10 text-foreground" : "text-muted-foreground"
                    } flex justify-center items-center gap-2 w-full sm:w-fit text-sm`}
                    onClick={() => setStatus(x.status)}>
                    {x.icon}
                    {x.label}
                  </Button>
                );
              })}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-x-auto">
        <Table className="border bg-card">
          <TableHeader className="">
            <TableRow className="">
              <TableHead className="h-10">{t("col_identifier")}</TableHead>
              <TableHead className="h-10">{t("col_sent_in")}</TableHead>
              <TableHead className="h-10">{t("col_completion_time")}</TableHead>
              <TableHead className="h-10">{t("col_status")}</TableHead>
              <TableHead className="text-right h-10">{t("col_actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => {
              return (
                <TableRow key={submission.id} className="text-xs text-foreground/80 hover:bg-transparent">
                  <TableCell className="p-0 pl-4 font-semibold">{submission.identifier}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex justify-start items-center gap-2">
                      <span className="font-semibold">{new Date(submission.created_at).toLocaleString()}</span>
                      <span className="text-muted-foreground">
                        ({formatDateRelativeToNow(submission.created_at, user.locale)})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex justify-start items-center gap-1">
                      <ClockIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="font-semibold">{formatTime(submission.completion_time ?? 0, 2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <SubmissionStatusBadge status={submission.status as TSubmissionStatus} />
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <SubmissionDetails blocks={app.blocks} submission={submission}>
                      <Button variant={"outline"} size={"xs"} className="">
                        {t("label_view_details")}
                      </Button>
                    </SubmissionDetails>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center gap-4">
        <Button disabled={disableBack} onClick={handleBack} variant={"outline"} size={"sm"}>
          {t("label_back")}
        </Button>
        <Button disabled={disabledNext} onClick={handleNext} variant={"outline"} size={"sm"}>
          {t("label_next")}
        </Button>
      </div>
    </div>
  );
};

export default SubmissionsWrapper;
