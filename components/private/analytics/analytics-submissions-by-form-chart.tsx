"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useGlobalStore from "@/stores/global";
import { TrendingDown, TrendingUp } from "lucide-react";
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

  // Process data
  const viewsCountMap = new Map<string, number>();
  const submissionsCountMap = new Map<string, number>();

  viewLogs.forEach((log) => {
    viewsCountMap.set(log.form_id, (viewsCountMap.get(log.form_id) || 0) + 1);
  });

  submissionLogs.forEach((log) => {
    submissionsCountMap.set(log.form_id, (submissionsCountMap.get(log.form_id) || 0) + 1);
  });

  const formData = forms.map((form) => ({
    formId: form.id,
    formName: form.name,
    views: viewsCountMap.get(form.id) || 0,
    submissions: submissionsCountMap.get(form.id) || 0,
  }));

  const hasForms = formData.length > 0;
  const totalViews = formData.reduce((sum, form) => sum + form.views, 0);
  const totalSubmissions = formData.reduce((sum, form) => sum + form.submissions, 0);
  const overallConversion = totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0;

  return (
    <div className="border-none shadow-sm w-full bg-transparent">
      <div className="pb-3 px-0 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">{t("label_forms")}</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground first-letter:uppercase">{t("label_conversion")}:</span>
            <span className="font-medium">{overallConversion}%</span>
          </div>
        </div>
      </div>
      <div className="space-y-6 p-0">
        {!hasForms && (
          <div className="border border-dashed rounded-lg flex flex-col items-center justify-center p-8 gap-2">
            <p className="text-muted-foreground text-sm">{t("label_no_forms")}</p>
          </div>
        )}

        {hasForms && (
          <div className="grid gap-4">
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
    </div>
  );
};

const FormItem = ({ formName, views, submissions }: IFormItemProps) => {
  const t = useTranslations("app");
  const conversionRate = views > 0 ? Math.round((submissions / views) * 100) : 0;

  const getBadgeConfig = () => {
    if (conversionRate >= 50)
      return {
        variant: "success" as const,
        icon: <TrendingUp className="h-3 w-3" />,
        trend: "up",
      };
    if (conversionRate <= 20)
      return {
        variant: "destructive" as const,
        icon: <TrendingDown className="h-3 w-3" />,
        trend: "down",
      };
    return {
      variant: "default" as const,
      icon: null,
      trend: "neutral",
    };
  };

  const badgeConfig = getBadgeConfig();

  return (
    <Card className="group p-4 rounded">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="font-medium text-base line-clamp-2 group-hover:text-primary transition-colors">{formName}</h3>
        <div className="flex items-center gap-2">
          <Badge
            variant={badgeConfig.variant}
            className="px-2.5 py-1 flex gap-1.5 items-center rounded-md transition-transform group-hover:scale-105">
            {badgeConfig.icon && <span className="text-xs">{badgeConfig.icon}</span>}
            <span className="text-xs font-semibold">{conversionRate}%</span>
          </Badge>
        </div>
      </div>
      <Progress value={conversionRate} className="h-2 mb-3" />
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{t("label_views")}:</span>
          <span className="font-medium text-foreground">{views.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{t("label_submissions")}:</span>
          <span className="font-medium text-foreground">{submissions.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsSubmissionsByFormChart;
