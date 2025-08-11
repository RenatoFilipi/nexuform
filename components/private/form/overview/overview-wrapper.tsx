"use client";

import FormStatusBadge from "@/components/private/shared/custom/form-status-badge";
import { Button } from "@/components/ui/button";
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
import {
  formatDateRelativeToNow,
  formatDecimal,
  formatTime,
  getAverageCompletionRate,
  getAverageCompletionTime,
  getPreviousDateRange,
} from "@/utils/functions";
import { IContext, IInterval } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, EyeIcon, LayersIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DateRangePicker from "../../shared/custom/date-range-picker";
import RestrictedAccessUI from "../../shared/pages/restricted-access-ui";
import SubscriptionUI from "../../shared/pages/subscription-ui";
import OverviewActivityChart from "./overview-activity-chart";
import { motion, AnimatePresence } from "framer-motion";

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
  context: IContext;
  dates: IInterval;
  submissionLogsCompare: ESubmissionLog[];
  viewLogsCompare: EViewLog[];
}

const OverviewWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const pathname = usePathname();
  const supabase = createClient();
  const orgId = pathname.split("/")[3];
  const formId = pathname.split("/")[5];
  const editorPath = `/dashboard/organizations/${orgId}/form/${formId}/editor`;

  const query = useQuery({
    queryKey: ["overview-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForm(props.form);
      app.setSubmissionLogs(props.submissionLogs);
      app.setViewLogs(props.viewLogs);
      app.setViewLogsCompare(props.viewLogsCompare);
      app.setSubmissionLogsCompare(props.submissionLogsCompare);
      app.setFrom(props.dates.from);
      app.setTo(props.dates.to);
      app.setContext(props.context);
      return null;
    },
  });

  const onSelectRange = async (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    app.setFrom(fromDate);
    app.setTo(toDate);
    const formId = app.form.id;
    const prevRange = getPreviousDateRange(fromDate, toDate);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .eq("form_id", formId)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .eq("form_id", formId)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    if (!submissionLogs.error) app.setSubmissionLogs(submissionLogs.data);
    if (!viewLogs.error) app.setViewLogs(viewLogs.data);

    const submissionLogsPrev = await supabase
      .from("submission_logs")
      .select("*")
      .eq("form_id", formId)
      .gte("created_at", prevRange.from.toISOString())
      .lte("created_at", prevRange.to.toISOString());

    const viewLogsPrev = await supabase
      .from("view_logs")
      .select("*")
      .eq("form_id", formId)
      .gte("created_at", prevRange.from.toISOString())
      .lte("created_at", prevRange.to.toISOString());

    if (!submissionLogsPrev.error) app.setSubmissionLogsCompare(submissionLogsPrev.data);
    if (!viewLogsPrev.error) app.setViewLogsCompare(viewLogsPrev.data);
  };

  if (query.isPending) return null;

  if (!app.context.isSubscriptionActive) {
    return <SubscriptionUI />;
  }

  if (!app.context.isOrgOwner && app.subscription.plan !== "pro") {
    return <RestrictedAccessUI />;
  }

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-6 sm:gap-2">
      {/* header */}
      <div className="flex flex-col gap-4 w-full sm:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full sm:w-fit gap-4">
          <div className="flex justify-center items-center gap-2">
            <LayersIcon className="w-5 h-5 text-muted-foreground" />
            <h1 className="font-semibold text-lg sm:text-xl truncate sm:max-w-[290px]">{app.form.name}</h1>
          </div>
          <FormStatusBadge status={app.form.status as TFormStatus} />
        </div>
        <div className="flex gap-4 w-full sm:w-fit">
          <DateRangePicker
            initialRange={{ from: props.dates.from.toISOString(), to: props.dates.to.toISOString() }}
            onChange={(range) => {
              if (!range) return;
              onSelectRange(range.from, range.to);
            }}
            align="end"
          />
          <Button variant={"secondary"} size={"sm"} className="w-full" asChild>
            <Link href={editorPath}>
              <ArrowUpRightIcon className="w-4 h-4 mr-2" />
              {t("nav_editor")}
            </Link>
          </Button>
        </div>
      </div>
      <span className="text-sm text-muted-foreground mb-5 hidden sm:flex">
        {t("label_last_updated")} {formatDateRelativeToNow(app.form.updated_at, user.locale)}
      </span>
      {/* content */}
      <div className="flex flex-col gap-6">
        <OverviewMetrics />
        <OverviewActivityChart />
      </div>
    </div>
  );
};
const OverviewMetrics = () => {
  const t = useTranslations("app");
  const app = useAppStore();

  // Dados período atual (sem filtro, todos os logs)
  const totalViews = app.viewLogs.length;
  const totalSubmissions = app.submissionLogs.length;
  const avgCompletionTime = getAverageCompletionTime(app.submissionLogs.map((x) => x.completion_time));
  const avgCompletionRate = getAverageCompletionRate(totalViews, totalSubmissions);

  // Dados período comparação (sem filtro, todos os logs)
  const totalViewsCompare = app.viewLogsCompare.length;
  const totalSubmissionsCompare = app.submissionLogsCompare.length;
  const avgCompletionTimeCompare = getAverageCompletionTime(app.submissionLogsCompare.map((x) => x.completion_time));
  const avgCompletionRateCompare = getAverageCompletionRate(totalViewsCompare, totalSubmissionsCompare);

  // Formata delta com sinal +/-
  const formatDelta = (current: number, previous: number) => {
    const diff = current - previous;
    const sign = diff > 0 ? "+" : "";
    return sign + diff.toFixed(0);
  };

  // Formata variação percentual com sinal
  const formatPercentage = (current: number, previous: number) => {
    if (previous === 0) {
      if (current === 0) return "0%";
      return "100%";
    }
    const diff = current - previous;
    const perc = (diff / previous) * 100;
    const sign = perc > 0 ? "+" : "";
    return sign + formatDecimal(perc) + "%";
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <OverviewCard
        name={t("label_total_views")}
        value={totalViews.toString()}
        previousValue={totalViewsCompare.toString()}
        valueCompare={formatDelta(totalViews, totalViewsCompare)}
        valuePercentage={formatPercentage(totalViews, totalViewsCompare)}
        icon={<EyeIcon className="w-4 h-4 text-primary" />}
      />
      <OverviewCard
        name={t("label_total_submissions")}
        value={totalSubmissions.toString()}
        previousValue={totalSubmissionsCompare.toString()}
        valueCompare={formatDelta(totalSubmissions, totalSubmissionsCompare)}
        valuePercentage={formatPercentage(totalSubmissions, totalSubmissionsCompare)}
        icon={<SendIcon className="w-4 h-4 text-primary" />}
      />
      <OverviewCard
        name={t("label_completion_rate")}
        value={`${formatDecimal(avgCompletionRate)}%`}
        previousValue={`${formatDecimal(avgCompletionRateCompare)}%`}
        valueCompare={formatDelta(avgCompletionRate, avgCompletionRateCompare)}
        valuePercentage={formatPercentage(avgCompletionRate, avgCompletionRateCompare)}
        icon={<VoteIcon className="w-4 h-4 text-primary" />}
      />
      <OverviewCard
        name={t("label_avg_completion_time")}
        value={formatTime(avgCompletionTime, 1)}
        previousValue={formatTime(avgCompletionTimeCompare, 1)}
        valueCompare={formatTime(avgCompletionTime - avgCompletionTimeCompare, 1)}
        valuePercentage={formatPercentage(avgCompletionTime, avgCompletionTimeCompare)}
        icon={<TimerIcon className="w-4 h-4 text-primary" />}
      />
    </div>
  );
};
const OverviewCard = ({
  name,
  value,
  previousValue,
  icon,
  valueCompare,
  valuePercentage,
}: {
  name: string;
  value: string;
  previousValue?: string;
  icon: React.ReactNode;
  valueCompare: string;
  valuePercentage: string;
}) => {
  const t = useTranslations("app");
  const percentageNumber = parseFloat(valuePercentage);
  const percentageColor =
    percentageNumber > 0 ? "text-green-500" : percentageNumber < 0 ? "text-red-500" : "text-gray-400";

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <Card className="relative group p-4 flex flex-col justify-between w-full h-full border hover:border-primary bg-card shadow-sm rounded-lg transition-all duration-300 hover:shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="text-xs text-muted-foreground font-medium mb-2">{name}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={value}
              className="text-xl font-bold tracking-tight"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.1 }}>
              {value}
            </motion.span>
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={valuePercentage}
              className={`text-sm font-semibold ${percentageColor}`}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.1, delay: 0.1 }}>
              {valuePercentage}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center p-2 bg-foreground/5 rounded-lg text-primary group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
      </div>
      {previousValue && (
        <div className="mt-3 text-xs text-muted-foreground">
          {previousValue} {t("label_from_last_period")}
        </div>
      )}
    </Card>
  );
};

export default OverviewWrapper;
