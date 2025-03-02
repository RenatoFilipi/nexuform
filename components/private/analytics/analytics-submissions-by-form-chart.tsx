import { Progress } from "@/components/ui/progress";
import useAnalyticsStore from "@/stores/analytics";
import { formatDecimal } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";

const AnalyticsSubmissionsByFormChart = () => {
  const { submissions, forms } = useAnalyticsStore();

  const query = useQuery({
    queryKey: ["analyticsSubmissionsData"],
    queryFn: () => {
      const formCountMap: Record<string, number> = {};
      for (const submission of submissions) {
        formCountMap[submission.form_id] = (formCountMap[submission.form_id] || 0) + 1;
      }
      const subs = Object.entries(formCountMap).map(([form_id, count]) => ({
        form_id,
        name: forms.find((f) => f.id === form_id)?.name || form_id,
        count,
      }));

      return { subs };
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending || !query.data) return null;
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <span>Submissions by form</span>
      </div>
      <div className="flex flex-col gap-4">
        {query.data.subs.map((sub) => {
          const percentage = (100 * sub.count) / submissions.length;
          return (
            <div key={sub.form_id} className="flex flex-col gap-2 border p-4 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm">{sub.name}</span>
                <div className="flex justify-center items-center gap-2">
                  <span className="text-sm">{sub.count}</span>
                  <span className="text-xs text-foreground/80">({formatDecimal(percentage, 2)}%)</span>
                </div>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsSubmissionsByFormChart;
