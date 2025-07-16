"use client";

import DateRangePicker from "@/components/private/shared/custom/date-range-picker";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
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
import { formatDecimal, formatTime, getAverageCompletionRate, getAverageCompletionTime } from "@/utils/functions";
import { IContext } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import AnalyticsSubmissionsByFormChart from "./analytics-submissions-by-form-chart";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  context: IContext;
}

const AnalyticsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["analytics-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForms(props.forms);
      app.setViewLogs(props.viewLogs);
      app.setSubmissionLogs(props.submissionLogs);
      app.setContext(props.context);
      return null;
    },
  });

  const onSelectRange = async (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    app.setFrom(fromDate);
    app.setTo(toDate);

    const formIds = app.forms.map((x) => x.id);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .in("form_id", formIds)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .in("form_id", formIds)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    if (!submissionLogs.error) app.setSubmissionLogs(submissionLogs.data);
    if (!viewLogs.error) app.setViewLogs(viewLogs.data);
  };

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_analytics")}</h1>
        <DateRangePicker
          initialRange={{
            from: app.from.toISOString(),
            to: app.to.toISOString(),
          }}
          onChange={(range) => {
            if (!range) return;
            onSelectRange(range.from, range.to);
          }}
        />
      </div>
      <div className="flex flex-col">
        <AnalyticsMetrics />
      </div>
    </div>
  );
};
const AnalyticsMetrics = () => {
  const t = useTranslations("app");
  const app = useAppStore();

  const totalViews = app.viewLogs.length.toString();
  const totalSubmissions = app.submissionLogs.length.toString();
  const avgCompletionTime = formatTime(getAverageCompletionTime(app.submissionLogs.map((x) => x.completion_time)), 1);
  const avgCompletionRate = `${formatDecimal(
    getAverageCompletionRate(app.viewLogs.length, app.submissionLogs.length)
  )}%`;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          name={t("label_total_views")}
          value={totalViews}
          icon={<EyeIcon className="w-5 h-5 text-primary" />}
        />
        <AnalyticsCard
          name={t("label_total_submissions")}
          value={totalSubmissions}
          icon={<SendIcon className="w-5 h-5 text-primary" />}
        />
        <AnalyticsCard
          name={t("label_completion_rate")}
          value={avgCompletionRate}
          icon={<VoteIcon className="w-5 h-5 text-primary" />}
        />
        <AnalyticsCard
          name={t("label_avg_completion_time")}
          value={avgCompletionTime}
          icon={<TimerIcon className="w-5 h-5 text-primary" />}
        />
      </div>
      <AnalyticsSubmissionsByFormChart />
    </div>
  );
};
const AnalyticsCard = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="group relative p-4 flex flex-col gap-4 w-full h-full border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-sm overflow-hidden">
      {/* Subtle background effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex justify-between items-start w-full z-10">
        <span className="text-sm font-medium text-muted-foreground">{name}</span>
        <div className="flex justify-center items-center p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
      </div>

      <div className="flex flex-col gap-1 z-10">
        <span className="text-xl font-bold tracking-tight">{value}</span>
      </div>
    </Card>
  );
};

export default AnalyticsWrapper;
