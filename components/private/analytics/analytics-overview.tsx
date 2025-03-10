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
  const averageCompletionTime = formatTime(
    formsAnalytics.reduce((acc, val) => {
      return (
        acc + (val.avg_completion_time !== null && val.avg_completion_time !== undefined ? val.avg_completion_time : 0)
      );
    }, 0) / formsAnalytics.length,
    1
  );
  const averageCompletionRate = formatDecimal(
    formsAnalytics.reduce((acc, val) => {
      return (
        acc + (val.avg_completion_rate !== null && val.avg_completion_rate !== undefined ? val.avg_completion_rate : 0)
      );
    }, 0) / formsAnalytics.length
  );

  return (
    <div className="grid sm:grid-cols-4 gap-2 sm:gap-6">
      <CardTemplate
        name={t("label_total_views")}
        value={totalViews}
        icon={<EyeIcon className="w-4 h-4 text-primary" />}
      />
      <CardTemplate
        name={t("label_total_submissions")}
        value={totalSubmissions}
        icon={<SendIcon className="w-4 h-4 text-primary" />}
      />
      <CardTemplate
        name={t("label_completion_rate")}
        value={averageCompletionRate + "%"}
        icon={<VoteIcon className="w-4 h-4 text-primary" />}
      />
      <CardTemplate
        name={t("label_avg_completion_time")}
        value={averageCompletionTime}
        icon={<TimerIcon className="w-4 h-4 text-primary" />}
      />
    </div>
  );
};

const CardTemplate = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="px-4 py-3 flex sm:flex-col flex-1 justify-between gap-8 items-start">
      <div className="flex sm:justify-between items-center sm:w-full h-full">
        <div className="flex justify-between w-full items-center gap-2 flex-row-reverse sm:flex-row">
          <span className="text-xs sm:text-sm text-foreground/80 font-medium">{name}</span>
          <div className="flex justify-center items-center">{icon}</div>
        </div>
      </div>
      <span className="text-lg font-medium">{value}</span>
    </Card>
  );
};

export default AnalyticsOverview;
