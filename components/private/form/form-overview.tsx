"use client";

import FormStatusBadge from "@/components/shared/badges/form-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import {
  formatDateRelativeToNow,
  formatDecimal,
  formatTime,
  getAverageCompletionRate,
  getAverageCompletionTime,
} from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { EyeIcon, PenIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import FormSubmissionsActivityChart from "./form-submissions-activity-chart";

const FormOverview = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const user = useUserStore();
  const totalViews = global.viewLogs.length.toString();
  const totalSubmissions = global.submissionLogs.length.toString();
  const avgCompletionTime = formatTime(
    getAverageCompletionTime(global.submissionLogs.map((x) => x.completion_time)),
    1
  );
  const avgCompletionRate = `${formatDecimal(
    getAverageCompletionRate(global.viewLogs.length, global.submissionLogs.length)
  )}%`;
  const notReviewedSubmissions = global.submissions.filter((x) => x.status === "not_reviewed").length;
  const updatedAt = formatDateRelativeToNow(global.form.updated_at, user.locale);

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      <div className="flex flex-col justify-center items-start">
        <div className="flex justify-between items-center flex-col sm:flex-row w-full gap-4">
          <div className="flex sm:justify-start justify-between items-center gap-3 w-full">
            <div className="flex justify-start items-center gap-2">
              <h1 className="font-semibold text-base truncate max-w-[240px]">{global.form.name}</h1>
            </div>
            <FormStatusBadge status={global.form.status as TFormStatus} />
          </div>
          <div className="flex justify-center items-center gap-4 w-full sm:justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/editor/${global.form.id}`} className="w-full sm:w-fit">
                <PenIcon className="w-4 h-4 mr-2" />
                {t("label_editor")}
              </Link>
            </Button>
          </div>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:flex">
          {t("label_last_updated")} {updatedAt}
        </span>
      </div>
      <div className="gap-6 grid sm:grid-cols-2">
        <div className="grid grid-cols-2 sm:grid-rows-4 sm:grid-cols-2 gap-2 sm:gap-6">
          <CardTemplate
            name={t("label_total_views")}
            content={
              <div>
                <span className="text-lg font-bold">{totalViews}</span>
              </div>
            }
            icon={<EyeIcon className="w-4 h-4 text-primary" />}
          />
          <CardTemplate
            name={t("label_total_submissions")}
            content={
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{totalSubmissions}</span>
                {notReviewedSubmissions > 0 && (
                  <Badge variant={"warning"}>
                    {t("label_not_reviewed")}: {notReviewedSubmissions}
                  </Badge>
                )}
              </div>
            }
            icon={<SendIcon className="w-4 h-4 text-primary" />}
          />
          <CardTemplate
            name={t("label_completion_rate")}
            content={
              <div>
                <span className="text-lg font-bold">{avgCompletionRate}</span>
              </div>
            }
            icon={<VoteIcon className="w-4 h-4 text-primary" />}
          />
          <CardTemplate
            name={t("label_avg_completion_time")}
            content={
              <div>
                <span className="text-lg font-bold">{avgCompletionTime}</span>
              </div>
            }
            icon={<TimerIcon className="w-4 h-4 text-primary" />}
          />
        </div>
        <FormSubmissionsActivityChart />
      </div>
    </div>
  );
};

const CardTemplate = ({ name, icon, content }: { name: string; icon: React.ReactNode; content: React.ReactNode }) => {
  return (
    <Card className="p-4 justify-between flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm text-foreground/70">{name}</span>
        <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">{icon}</div>
      </div>
      {content}
    </Card>
  );
};

export default FormOverview;
