import { Progress } from "@/components/ui/progress";
import useAnalyticsStore from "@/stores/analytics";
import { formatDecimal } from "@/utils/functions";
import { FormSubmission } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const AnalyticsSubmissionsByFormChart = () => {
  const t = useTranslations("app");
  const { submissions, forms } = useAnalyticsStore();

  const { data: formSubmissions, isLoading } = useQuery<FormSubmission[]>({
    queryKey: ["analyticsSubmissionsData"],
    queryFn: () => {
      const totalSubmissions = submissions.length;
      return forms
        .map((form) => {
          const count = submissions.filter((s) => s.form_id === form.id).length;
          const percentage = totalSubmissions > 0 ? (count / totalSubmissions) * 100 : 0;
          return {
            formId: form.id,
            name: form.name,
            count,
            percentage,
          };
        })
        .sort((a, b) => b.count - a.count);
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-10 rounded bg-muted animate-pulse" />
            </div>
            <Progress value={0} className="h-2 bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!formSubmissions?.length) {
    return (
      <div className="border flex flex-col items-center justify-center rounded-lg p-6 gap-3">
        <div className="p-2 rounded bg-primary/5">
          <SendIcon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{t("label_no_submission")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold">{t("label_submissions_by_form")}</h3>

      <div className="flex flex-col gap-4">
        {formSubmissions.map(({ formId, name, count, percentage }) => (
          <div key={formId} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium truncate max-w-[180px]">{name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{count}</span>
                <span className="text-xs text-muted-foreground">({formatDecimal(percentage, 1)}%)</span>
              </div>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsSubmissionsByFormChart;
