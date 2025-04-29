import { Card } from "@/components/ui/card";
import useAnalyticsStore from "@/stores/analytics";
import { formatDecimal, formatTime } from "@/utils/functions";
import { EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const AnalyticsOverview = () => {
  const t = useTranslations("app");
  const { formsAnalytics } = useAnalyticsStore();

  const totalViews = formsAnalytics.reduce((sum, form) => sum + (form.total_views || 0), 0);
  const totalSubmissions = formsAnalytics.reduce((sum, form) => sum + (form.total_submissions || 0), 0);
  const completionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;
  const totalCompletionTime = formsAnalytics.reduce(
    (sum, form) => sum + (form.avg_completion_time || 0) * (form.total_submissions || 0),
    0
  );
  const avgCompletionTime = totalSubmissions > 0 ? totalCompletionTime / totalSubmissions : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <AnalyticsCard
        name={t("label_total_views")}
        value={totalViews.toString()}
        icon={<EyeIcon className="w-4 h-4 text-primary" />}
      />
      <AnalyticsCard
        name={t("label_total_submissions")}
        value={totalSubmissions.toString()}
        icon={<SendIcon className="w-4 h-4 text-primary" />}
      />
      <AnalyticsCard
        name={t("label_completion_rate")}
        value={totalViews > 0 ? `${formatDecimal(completionRate)}%` : "--"}
        icon={<VoteIcon className="w-4 h-4 text-primary" />}
      />
      <AnalyticsCard
        name={t("label_avg_completion_time")}
        value={totalSubmissions > 0 ? formatTime(avgCompletionTime, 1) : "--"}
        icon={<TimerIcon className="w-4 h-4 text-primary" />}
      />
    </div>
  );
};

const AnalyticsCard = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="p-4 justify-between flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm text-foreground/70">{name}</span>
        <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">{icon}</div>
      </div>
      <span className="text-base font-bold">{value}</span>
    </Card>
  );
};

export default AnalyticsOverview;
