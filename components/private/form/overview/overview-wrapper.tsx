"use client";

import FormStatusBadge from "@/components/shared/badges/form-status-badge";
import { Button } from "@/components/ui/button";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubmissionLog, ESubscription, EViewLog } from "@/utils/entities";
import {
  formatDateRelativeToNow,
  formatDecimal,
  formatTime,
  getAverageCompletionRate,
  getAverageCompletionTime,
  getDateRangeFromToday,
} from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import DateRangePicker from "../../shared/core/date-range-picker";
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
  const supabase = createClient();

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
    queryKey: ["form-overview-data"],
    queryFn: () => {
      const dates = getDateRangeFromToday(7);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setLocale(props.locale);
      global.setForm(props.form);
      global.setSubmissionLogs(props.submissionLogs);
      global.setViewLogs(props.viewLogs);
      global.setFrom(dates.startDate);
      global.setTo(dates.endDate);
      return null;
    },
  });

  const onSelectRange = async (from: string, to: string) => {
    const fromD = new Date(from);
    const toD = new Date(to);
    global.setFrom(fromD);
    global.setTo(toD);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .eq("form_id", global.form.id)
      .gte("created_at", fromD.toISOString())
      .lte("created_at", toD.toISOString());

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .eq("form_id", global.form.id)
      .gte("created_at", fromD.toISOString())
      .lte("created_at", toD.toISOString());

    if (!submissionLogs.error) global.setSubmissionLogs(submissionLogs.data);
    if (!viewLogs.error) global.setViewLogs(viewLogs.data);
  };

  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-6">
      {/* header */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="flex justify-between items-center gap-4 w-full sm:w-fit">
            <h1 className="font-bold text-lg sm:text-xl truncate sm:max-w-[290px]">{global.form.name}</h1>
          </div>
          <div className="flex justify-center items-center gap-4">
            <DateRangePicker
              initialRange={{
                from: global.from.toISOString(),
                to: global.to.toISOString(),
              }}
              onChange={(range) => {
                if (!range) return;
                onSelectRange(range.from, range.to);
              }}
            />
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/dashboard/editor/${global.form.id}`} className="w-full sm:w-fit">
                <ArrowUpRightIcon className="w-4 h-4 mr-2" />
                {t("nav_editor")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-start items-center gap-3">
          <FormStatusBadge status={global.form.status as TFormStatus} />
          <span className="text-sm text-muted-foreground">
            {t("label_last_updated")} {formatDateRelativeToNow(global.form.updated_at, user.locale)}
          </span>
        </div>
      </div>
      {/* content */}
      <div className="gap-6 grid sm:grid-cols-3">
        {/* cards */}
        <div className="grid sm:grid-cols-1 col-span-2 sm:col-span-1 sm:gap-6 gap-3">
          <OverviewCard
            name={t("label_total_views")}
            content={
              <div>
                <span className="text-base font-semibold">{totalViews}</span>
              </div>
            }
            icon={<EyeIcon className="w-4 h-4 text-primary" />}
          />
          <OverviewCard
            name={t("label_total_submissions")}
            content={
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">{totalSubmissions}</span>
              </div>
            }
            icon={<SendIcon className="w-4 h-4 text-primary" />}
          />
          <OverviewCard
            name={t("label_completion_rate")}
            content={
              <div>
                <span className="text-base font-semibold">{avgCompletionRate}</span>
              </div>
            }
            icon={<VoteIcon className="w-4 h-4 text-primary" />}
          />
          <OverviewCard
            name={t("label_avg_completion_time")}
            content={
              <div>
                <span className="text-base font-semibold">{avgCompletionTime}</span>
              </div>
            }
            icon={<TimerIcon className="w-4 h-4 text-primary" />}
          />
        </div>
        {/* chart */}
        <div className="grid col-span-2">
          <OverviewActivityChart />
        </div>
      </div>
    </div>
  );
};

export default OverviewWrapper;
