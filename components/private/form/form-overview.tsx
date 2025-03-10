"use client";

import FormStatusBadge from "@/components/shared/form-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useFormStore from "@/stores/form";
import { formatDecimal, formatTime } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { ArrowRightIcon, EyeIcon, SendIcon, Share2Icon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import FormShare from "./form-share";
import FormSubmissionsActivityChart from "./form-submissions-activity-chart";

const FormOverview = () => {
  const t = useTranslations("app");
  const { formAnalytics, form } = useFormStore();
  const { total_submissions, total_views, avg_completion_rate, avg_completion_time } = formAnalytics;
  const totalViews = total_views === 0 ? "--" : total_views.toString();
  const totalSubmissions = total_submissions === 0 ? "--" : total_submissions.toString();
  const averageCompletionRate = avg_completion_rate !== null ? `${formatDecimal(avg_completion_rate)}%` : "--";
  const averageCompletionTime = avg_completion_time !== null ? `${formatTime(avg_completion_time, 1)}` : "--";

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      <div className="flex justify-between items-center flex-col sm:flex-row w-full gap-4">
        <div className="flex sm:justify-start justify-between items-center gap-3 w-full">
          <div className="flex justify-start items-center gap-2">
            <h1 className="font-medium text-sm truncate max-w-[240px]">{form.name}</h1>
          </div>
          <FormStatusBadge status={form.status as TFormStatus} />
        </div>
        <div className="flex justify-center items-center gap-4 w-full sm:justify-end">
          <FormShare form={form}>
            <Button variant="outline" size="sm" className="w-full sm:w-fit">
              <Share2Icon className="w-4 h-4 mr-2" />
              {t("label_share")}
            </Button>
          </FormShare>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/dashboard/editor/${form.id}`} className="w-full sm:w-fit">
              <ArrowRightIcon className="w-4 h-4 mr-2" />
              {t("label_editor")}
            </Link>
          </Button>
        </div>
      </div>
      <div className="gap-6 grid sm:grid-cols-2">
        <div className="grid grid-cols-1 sm:grid-rows-4 sm:grid-cols-2 gap-2 sm:gap-6">
          <CardTemplate
            name={t("label_total_views")}
            value={totalViews}
            icon={<EyeIcon className="w-4 h-4 text-primary" />}
          />
          <CardTemplate
            name={t("label_total_submissions")}
            value={totalSubmissions}
            icon={<SendIcon className="w-4 h-4 text-primary" />}
          />
          <CardTemplate
            name={t("label_completion_rate")}
            value={averageCompletionRate}
            icon={<VoteIcon className="w-4 h-4 text-primary" />}
          />
          <CardTemplate
            name={t("label_avg_completion_time")}
            value={averageCompletionTime}
            icon={<TimerIcon className="w-4 h-4 text-primary" />}
          />
        </div>
        <FormSubmissionsActivityChart />
      </div>
    </div>
  );
};

const CardTemplate = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="px-4 py-3 flex sm:flex-col flex-1 justify-between gap-4 items-center sm:items-start">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2 justify-between w-full">
          <span className="text-xs text-foreground/80">{name}</span>
          <div className="flex justify-center items-center">{icon}</div>
        </div>
      </div>
      <span className="font-medium">{value}</span>
    </Card>
  );
};

export default FormOverview;
