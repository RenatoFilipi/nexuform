import { Card } from "@/components/ui/card";
import useAnalyticsStore from "@/stores/analytics";
import { formatDecimal, formatTime } from "@/utils/functions";
import { EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const AnalyticsOverview = () => {
  const t = useTranslations("app");
  const { formsAnalytics } = useAnalyticsStore();

  const totalViews = formsAnalytics.reduce((acc, val) => acc + val.total_views, 0).toString();
  const totalSubmissions = formsAnalytics.reduce((acc, val) => acc + val.total_submissions, 0).toString();

  const averageCompletionTime =
    formsAnalytics.length < 1
      ? "--"
      : formatTime(
          formsAnalytics.reduce((acc, val) => acc + (val.avg_completion_time ?? 0), 0) / formsAnalytics.length,
          1
        );

  const averageCompletionRate =
    formsAnalytics.length <= 1
      ? "--"
      : `${formatDecimal(
          formsAnalytics.reduce((acc, val) => acc + (val.avg_completion_rate ?? 0), 0) / formsAnalytics.length
        )}%`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <AnalyticsCard name={t("label_total_views")} value={totalViews} icon={<EyeIcon className="w-4 h-4" />} />
      <AnalyticsCard
        name={t("label_total_submissions")}
        value={totalSubmissions}
        icon={<SendIcon className="w-4 h-4" />}
      />
      <AnalyticsCard
        name={t("label_completion_rate")}
        value={averageCompletionRate}
        icon={<VoteIcon className="w-4 h-4" />}
      />
      <AnalyticsCard
        name={t("label_avg_completion_time")}
        value={averageCompletionTime}
        icon={<TimerIcon className="w-4 h-4" />}
      />
    </div>
  );
};

const AnalyticsCard = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">{name}</span>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
      <span className="text-2xl font-semibold">{value}</span>
    </Card>
  );
};

export default AnalyticsOverview;
