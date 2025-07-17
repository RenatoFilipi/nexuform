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
  getDateRangeFromToday,
} from "@/utils/functions";
import { IContext } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DateRangePicker from "../../shared/custom/date-range-picker";
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
  context: IContext;
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
      const dates = getDateRangeFromToday(7);
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForm(props.form);
      app.setSubmissionLogs(props.submissionLogs);
      app.setViewLogs(props.viewLogs);
      app.setFrom(dates.startDate);
      app.setTo(dates.endDate);
      app.setContext(props.context);
      return null;
    },
  });

  const onSelectRange = async (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    app.setFrom(fromDate);
    app.setTo(toDate);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .eq("form_id", app.form.id as string)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .eq("form_id", app.form.id as string)
      .gte("created_at", fromDate.toISOString())
      .lte("created_at", toDate.toISOString());

    if (!submissionLogs.error) app.setSubmissionLogs(submissionLogs.data);
    if (!viewLogs.error) app.setViewLogs(viewLogs.data);
  };

  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-6 sm:gap-2">
      {/* header */}
      <div className="flex flex-col gap-4 w-full sm:flex-row justify-between items-center">
        <div className="flex justify-between items-center w-full sm:w-fit gap-4">
          <h1 className="font-semibold text-lg sm:text-xl truncate sm:max-w-[290px]">{app.form.name}</h1>
          <FormStatusBadge status={app.form.status as TFormStatus} />
        </div>
        <div className="flex gap-4 w-full sm:w-fit">
          <DateRangePicker
            initialRange={{ from: app.from.toISOString(), to: app.to.toISOString() }}
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

  const totalViews = app.viewLogs.length.toString();
  const totalSubmissions = app.submissionLogs.length.toString();
  const avgCompletionTime = formatTime(getAverageCompletionTime(app.submissionLogs.map((x) => x.completion_time)), 1);
  const avgCompletionRate = `${formatDecimal(
    getAverageCompletionRate(app.viewLogs.length, app.submissionLogs.length)
  )}%`;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
const OverviewCard = ({ name, icon, content }: { name: string; icon: React.ReactNode; content: React.ReactNode }) => {
  return (
    <Card className="group relative p-4 flex flex-col gap-4 w-full h-full border rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex justify-between items-start w-full z-10">
        <span className="text-sm font-medium text-muted-foreground">{name}</span>
        <div className="flex justify-center items-center p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
      </div>

      <div className="flex flex-col gap-1 z-10">
        <span className="text-xl font-bold tracking-tight">{content}</span>
      </div>
    </Card>
  );
};

export default OverviewWrapper;
