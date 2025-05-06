import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGlobalStore from "@/stores/global";
import { formatDecimal, formatTime, getAverageCompletionRate, getAverageCompletionTime } from "@/utils/functions";
import { ArrowUpRightIcon, EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import AnalyticsDetails from "./analytics-details";

const AnalyticsOverview = () => {
  const t = useTranslations("app");
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

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-6">
      <AnalyticsCard
        name={t("label_total_views")}
        value={totalViews}
        icon={<EyeIcon className="w-4 h-4 text-primary" />}
        view="total_views"
      />
      <AnalyticsCard
        name={t("label_total_submissions")}
        value={totalSubmissions}
        icon={<SendIcon className="w-4 h-4 text-primary" />}
        view="total_submissions"
      />
      <AnalyticsCard
        name={t("label_completion_rate")}
        value={avgCompletionRate}
        icon={<VoteIcon className="w-4 h-4 text-primary" />}
        view="completion_rate"
      />
      <AnalyticsCard
        name={t("label_avg_completion_time")}
        value={avgCompletionTime}
        icon={<TimerIcon className="w-4 h-4 text-primary" />}
        view="completion_time"
      />
    </div>
  );
};

type TView = "total_views" | "total_submissions" | "completion_rate" | "completion_time";

const AnalyticsCard = ({
  name,
  value,
  icon,
  view,
}: {
  name: string;
  value: string;
  icon: React.ReactNode;
  view: TView;
}) => {
  return (
    <Card className="group p-4 justify-between flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm">{name}</span>
        <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">{icon}</div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">{value}</span>
        <AnalyticsDetails view={view}>
          <Button variant={"outline"} size={"icon"} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRightIcon className="w-5 h-5" />
          </Button>
        </AnalyticsDetails>
      </div>
    </Card>
  );
};

export default AnalyticsOverview;
