import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useFormStore from "@/stores/form";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface IChartData {
  day: string;
  submission: number;
}

const OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
] as const;

const CHART_CONFIG: ChartConfig = {
  submission: {
    label: "Submissions",
    color: "#7C3AED",
  },
} as ChartConfig;

type HasDataAction = { type: "CHECK_DATA"; payload: IChartData[] };

const hasDataReducer = (state: boolean, action: HasDataAction): boolean => {
  switch (action.type) {
    case "CHECK_DATA":
      return action.payload.some((item) => item.submission > 0);
    default:
      return state;
  }
};

const SubmissionsActivityChart: React.FC = () => {
  const { overviewSubmissions } = useFormStore();
  const [days, setDays] = useState<number>(7);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);

  const barSize = days === 7 ? 20 : 10;

  const lastNDays = useMemo<IChartData[]>(
    () =>
      Array.from({ length: days }, (_, i) => ({
        day: format(subDays(new Date(), i), "dd/MM"),
        submission: 0,
      })).reverse(),
    [days]
  );

  const { data: submissions, isPending } = useQuery({
    queryKey: ["formOverviewChartData", overviewSubmissions, days],
    queryFn: () => overviewSubmissions || [],
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!submissions) return;

    const submissionCount: Record<string, number> = {};
    submissions.forEach((submission) => {
      if (!submission?.created_at) return;
      const day = format(parseISO(submission.created_at), "dd/MM");
      submissionCount[day] = (submissionCount[day] || 0) + 1;
    });

    const updatedChartData = lastNDays.map((data) => ({
      ...data,
      submission: submissionCount[data.day] || 0,
    }));

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [submissions, lastNDays]);

  if (isPending) return null;

  return (
    <div className="flex flex-col border py-3 px-4 rounded gap-3 relative">
      <div className="flex flex-col justify-center items-center sm:items-start">
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex justify-center items-center gap-3">
            {OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                variant="outline"
                size="xs"
                className={days === opt.value ? "bg-foreground/5" : ""}>
                {opt.label}
              </Button>
            ))}
          </div>
          {!hasData && (
            <Badge variant="warning" uppercase>
              No data available
            </Badge>
          )}
        </div>
      </div>
      <ChartContainer config={CHART_CONFIG}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            barSize={barSize}
            dataKey="submission"
            fill="var(--color-submission)"
            radius={8}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default SubmissionsActivityChart;
