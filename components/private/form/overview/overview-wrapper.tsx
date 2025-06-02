"use client";

import FormStatusBadge from "@/components/shared/badges/form-status-badge";
import { Button } from "@/components/ui/button";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubmissionLog, ESubscription, EViewLog } from "@/utils/entities";
import { formatDecimal, formatTime, getAverageCompletionRate, getAverageCompletionTime } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import OverviewActivityChart from "./overview-activity-chart";
import OverviewCard from "./overview-card";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  form: EForm;
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
}

const OverviewWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const global = useGlobalStore();

  const totalViews = global.viewLogs.length.toString();
  const totalSubmissions = global.submissionLogs.length.toString();
  const avgCompletionTime = formatTime(
    getAverageCompletionTime(global.submissionLogs.map((x) => x.completion_time)),
    1
  );
  const avgCompletionRate = `${formatDecimal(
    getAverageCompletionRate(global.viewLogs.length, global.submissionLogs.length)
  )}%`;

  const query = useQuery({
    queryKey: ["formOverviewData"],
    queryFn: () => {
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setLocale(props.locale);
      global.setForm(props.form);
      global.setSubmissionLogs(props.submissionLogs);
      global.setViewLogs(props.viewLogs);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div className="flex justify-between items-center gap-4 w-full sm:w-fit">
          <h1 className="font-semibold text-base truncate max-w-[240px]">{global.form.name}</h1>
          <FormStatusBadge status={global.form.status as TFormStatus} />
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/dashboard/editor/${global.form.id}`} className="w-full sm:w-fit">
            <ArrowUpRightIcon className="w-4 h-4 mr-2" />
            {t("nav_editor")}
          </Link>
        </Button>
      </div>
      {/* content */}
      <div className="gap-6 grid sm:grid-cols-2">
        {/* cards */}
        <div className="grid grid-cols-2 sm:grid-rows-2 sm:grid-cols-2 gap-2 sm:gap-6">
          <OverviewCard
            name={t("label_total_views")}
            content={
              <div>
                <span className="text-base font-bold">{totalViews}</span>
              </div>
            }
            icon={<EyeIcon className="w-4 h-4 text-primary" />}
          />
          <OverviewCard
            name={t("label_total_submissions")}
            content={
              <div className="flex justify-between items-center">
                <span className="text-base font-bold">{totalSubmissions}</span>
              </div>
            }
            icon={<SendIcon className="w-4 h-4 text-primary" />}
          />
          <OverviewCard
            name={t("label_completion_rate")}
            content={
              <div>
                <span className="text-base font-bold">{avgCompletionRate}</span>
              </div>
            }
            icon={<VoteIcon className="w-4 h-4 text-primary" />}
          />
          <OverviewCard
            name={t("label_avg_completion_time")}
            content={
              <div>
                <span className="text-base font-bold">{avgCompletionTime}</span>
              </div>
            }
            icon={<TimerIcon className="w-4 h-4 text-primary" />}
          />
        </div>
        {/* chart */}
        <OverviewActivityChart />
      </div>
    </div>
  );
};

export default OverviewWrapper;
