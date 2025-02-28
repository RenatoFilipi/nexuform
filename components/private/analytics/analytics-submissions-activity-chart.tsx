import useAnalyticsStore from "@/stores/analytics";
import { format, subDays } from "date-fns";
import { useMemo, useState } from "react";

interface IChartData {
  day: string;
  submission: number;
}

const AnalyticsSubmissionsActivityChart = () => {
  const { submissions, forms } = useAnalyticsStore();
  const [days, setDays] = useState<number>(30);

  const lastNDays = useMemo<IChartData[]>(
    () =>
      Array.from({ length: days }, (_, i) => ({
        day: format(subDays(new Date(), i), "dd/MM"),
        submission: 0,
      })).reverse(),
    [days]
  );

  return <></>;
};

export default AnalyticsSubmissionsActivityChart;
