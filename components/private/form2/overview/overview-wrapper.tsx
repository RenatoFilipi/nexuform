"use client";

import FormStatusBadge from "@/components/shared/badges/form-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePlatformStore from "@/stores/platform";
import useUserStore from "@/stores/user";
import {
  EForm,
  EOrganization,
  EProfile,
  ESubmissionLog,
  ESubscription,
  ETeamMemberProfile,
  EViewLog,
} from "@/utils/entities";
import {
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
import DateRangePicker from "../../shared/core/date-range-picker";
import OverviewActivityChart from "./overview-activity-chart";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
}

const OverviewWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const user = useUserStore();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["overview-page"],
    queryFn: () => {
      const dates = getDateRangeFromToday(7);
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations([props.organization]);
      pf.setSubscriptions([props.subscription]);
      pf.setTeamMemberProfiles([props.teamMemberProfile]);
      pf.setForms([props.form]);
      pf.setSubmissionLogs(props.submissionLogs);
      pf.setViewLogs(props.viewLogs);
      pf.setFrom(dates.startDate);
      pf.setTo(dates.endDate);
      return null;
    },
  });

  const form = pf.forms.length > 0 ? pf.forms[0] : null;

  const onSelectRange = async (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    pf.setFrom(fromDate);
    pf.setTo(toDate);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .eq("form_id", form?.id as string)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .eq("form_id", form?.id as string)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    if (!submissionLogs.error) pf.setSubmissionLogs(submissionLogs.data);
    if (!viewLogs.error) pf.setViewLogs(viewLogs.data);
  };

  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-col gap-4 w-full sm:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full sm:w-fit gap-4">
          <h1 className="font-semibold text-lg sm:text-xl truncate sm:max-w-[290px]">{form?.name}</h1>
          <FormStatusBadge status={form?.status as TFormStatus} />
        </div>
        <div className="flex gap-4">
          <DateRangePicker
            initialRange={{ from: pf.from.toISOString(), to: pf.to.toISOString() }}
            onChange={(range) => {
              if (!range) return;
              onSelectRange(range.from, range.to);
            }}
          />
          <Button variant={"secondary"} size={"sm"} className="w-full">
            <ArrowUpRightIcon className="w-4 h-4 mr-2" />
            {t("nav_editor")}
          </Button>
        </div>
      </div>
      {/* content */}
      <div className="gap-6 grid sm:grid-cols-3">
        <OverviewMetrics />
        <OverviewCharts />
      </div>
    </div>
  );
};
const OverviewMetrics = () => {
  const t = useTranslations("app");
  const pf = usePlatformStore();

  const totalViews = pf.viewLogs.length.toString();
  const totalSubmissions = pf.submissionLogs.length.toString();
  const avgCompletionTime = formatTime(getAverageCompletionTime(pf.submissionLogs.map((x) => x.completion_time)), 1);
  const avgCompletionRate = `${formatDecimal(getAverageCompletionRate(pf.viewLogs.length, pf.submissionLogs.length))}%`;

  return (
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
  );
};
const OverviewCharts = () => {
  return (
    <div className="grid col-span-2">
      <OverviewActivityChart />
    </div>
  );
};
const OverviewCard = ({ name, icon, content }: { name: string; icon: React.ReactNode; content: React.ReactNode }) => {
  return (
    <Card className="p-4 justify-between items-center flex gap-3 w-full">
      <div className="flex items-center w-full gap-3">
        <div className="flex justify-center items-center p-2 bg-primary/10 rounded">{icon}</div>
        <span className="text-xs">{name}</span>
      </div>
      {content}
    </Card>
  );
};

export default OverviewWrapper;
