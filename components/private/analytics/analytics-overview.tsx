import { Card } from "@/components/ui/card";
import useGlobalStore from "@/stores/global";
import { formatDecimal, formatTime, getAverageCompletionRate, getAverageCompletionTime } from "@/utils/functions";
import { EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <div className="grid grid-cols-2 sm:grid-rows-3 sm:grid-cols-2 gap-2 sm:gap-6">
      <AnalyticsCard
        name={t("label_total_views")}
        value={totalViews}
        icon={<EyeIcon className="w-4 h-4 text-primary" />}
      />
      <AnalyticsCard
        name={t("label_total_submissions")}
        value={totalSubmissions}
        icon={<SendIcon className="w-4 h-4 text-primary" />}
      />
      <AnalyticsCard
        name={t("label_completion_rate")}
        value={avgCompletionRate}
        icon={<VoteIcon className="w-4 h-4 text-primary" />}
      />
      <AnalyticsCard
        name={t("label_avg_completion_time")}
        value={avgCompletionTime}
        icon={<TimerIcon className="w-4 h-4 text-primary" />}
      />
    </div>
  );
};

const AnalyticsCard = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="p-4 justify-between flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm">{name}</span>
        <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">{icon}</div>
      </div>
      <span className="text-lg font-bold">{value}</span>
    </Card>
  );
};

export default AnalyticsOverview;
