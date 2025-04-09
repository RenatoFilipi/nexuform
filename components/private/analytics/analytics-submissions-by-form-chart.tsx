import { Progress } from "@/components/ui/progress";
import useAnalyticsStore from "@/stores/analytics";
import { formatDecimal } from "@/utils/functions";
import { ISubmissionsByForm } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const AnalyticsSubmissionsByFormChart = () => {
  const t = useTranslations("app");
  const { submissions, forms } = useAnalyticsStore();
  const [subs, setSubs] = useState<ISubmissionsByForm[]>([]);

  const query = useQuery({
    queryKey: ["analyticsSubmissionsData"],
    queryFn: () => {
      const localSubs = forms.map((f) => {
        const count = submissions.filter((s) => s.form_id === f.id).length;
        return { count, formId: f.id, name: f.name } as ISubmissionsByForm;
      });
      setSubs(localSubs);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending)
    return (
      <div className="flex flex-col h-full gap-6">
        <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
        <div className="flex flex-col gap-4">
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
      </div>
    );

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold">{t("label_submissions_by_form")}</h3>
      </div>

      {subs.length <= 0 ? (
        <div className="border flex justify-center items-center flex-1 rounded-lg flex-col gap-3 p-6 bg-muted/30">
          <div className="p-3 rounded-full bg-primary/10">
            <SendIcon className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">{t("label_no_submission")}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {subs
            .sort((a, b) => b.count - a.count)
            .map((sub) => {
              const percentage = (100 * sub.count) / submissions.length;
              return (
                <div key={sub.formId} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium truncate max-w-[180px]">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{sub.count}</span>
                      <span className="text-xs text-muted-foreground">({formatDecimal(percentage, 1)}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AnalyticsSubmissionsByFormChart;
