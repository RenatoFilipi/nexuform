"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useGlobalStore from "@/stores/global";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface IFormItemProps {
  formId: string;
  formName: string;
  views: number;
  submissions: number;
}

const AnalyticsSubmissionsByFormChart = () => {
  const t = useTranslations("app");
  const { forms, viewLogs, submissionLogs } = useGlobalStore();
  const viewsCountMap = new Map<string, number>();
  const submissionsCountMap = new Map<string, number>();

  viewLogs.forEach((log) => {
    const count = viewsCountMap.get(log.form_id) || 0;
    viewsCountMap.set(log.form_id, count + 1);
  });
  submissionLogs.forEach((log) => {
    const count = submissionsCountMap.get(log.form_id) || 0;
    submissionsCountMap.set(log.form_id, count + 1);
  });
  const formData = forms.map((form) => ({
    formId: form.id,
    formName: form.name,
    views: viewsCountMap.get(form.id) || 0,
    submissions: submissionsCountMap.get(form.id) || 0,
  }));
  const hasForms = formData.length > 0;

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-bold mb-4">{t("label_forms")}</h2>
      {!hasForms && <p className="text-muted-foreground">{t("label_no_forms")}</p>}
      {hasForms && (
        <div className="grid gap-6 w-full">
          {formData.map((form) => (
            <FormItem
              key={form.formId}
              formId={form.formId}
              formName={form.formName}
              views={form.views}
              submissions={form.submissions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FormItem = ({ formId, formName, views, submissions }: IFormItemProps) => {
  const t = useTranslations("app");
  const conversionRate = views > 0 ? Math.round((submissions / views) * 100) : 0;

  const getBadgeConfig = () => {
    if (conversionRate >= 50)
      return {
        variant: "success" as const,
        icon: <TrendingUpIcon className="h-3 w-3 mr-1" />,
      };
    if (conversionRate <= 20)
      return {
        variant: "destructive" as const,
        icon: <TrendingDownIcon className="h-3 w-3 mr-1" />,
      };
    return {
      variant: "default" as const,
      icon: null,
    };
  };

  const badgeConfig = getBadgeConfig();

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">{formName}</h3>
        <Badge variant={badgeConfig.variant} className="gap-1">
          {badgeConfig.icon}
          {conversionRate}% {t("label_conversion")}
        </Badge>
      </div>
      <Progress value={conversionRate} className="h-2" />
      <div className="flex justify-between text-sm">
        <div className="text-muted-foreground font-semibold text-xs">
          <span>{t("label_views")}:</span> {views}
        </div>
        <div className="text-muted-foreground font-semibold text-xs">
          <span>{t("label_submissions")}:</span> {submissions}
        </div>
      </div>
    </div>
  );
};
export default AnalyticsSubmissionsByFormChart;
