import useAnalyticsStore from "@/stores/analytics";
import { ConstructionIcon } from "lucide-react";

const AnalyticsSubmissionsByFormChart = () => {
  const { submissions, forms } = useAnalyticsStore();

  return (
    <div className="border flex justify-center items-center flex-col gap-2">
      <ConstructionIcon className="w-6 h-6 text-primary" />
      <span className="text-xs text-foreground/80">Under Development</span>
    </div>
  );
};

export default AnalyticsSubmissionsByFormChart;
