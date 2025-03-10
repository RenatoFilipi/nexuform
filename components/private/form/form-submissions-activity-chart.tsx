import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useFormStore from "@/stores/form";
import { minWidth640 } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useMedia } from "react-use";
import { Bar, CartesianGrid, ComposedChart, XAxis } from "recharts";

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
    color: "#3A6AED",
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

const FormSubmissionsActivityChart: React.FC = () => {
  const isDesktop = useMedia(minWidth640);
  const { overviewSubmissions } = useFormStore();
  const [days, setDays] = useState<number>(7);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const barSize = days === 7 ? 14 : 10;

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

  const todaySubmissions = chartData.find((data) => data.day === format(new Date(), "dd/MM"))?.submission || 0;
  const yesterdaySubmissions =
    chartData.find((data) => data.day === format(subDays(new Date(), 1), "dd/MM"))?.submission || 0;
  const submissionDifference = todaySubmissions - yesterdaySubmissions;

  if (isPending) return null;

  return (
    <div className="flex flex-col justify-between gap-4 relative border rounded p-4">
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
          {hasData && isDesktop && <BadgeDay submissionDifference={submissionDifference} />}
          {!hasData && <Badge variant="warning">No data available</Badge>}
        </div>
      </div>
      <ChartContainer config={CHART_CONFIG}>
        <ComposedChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
          <Bar
            barSize={barSize}
            dataKey="submission"
            fill="var(--color-submission)"
            radius={0}
            animationDuration={300}
          />
        </ComposedChart>
      </ChartContainer>
      {hasData && !isDesktop && <BadgeDay submissionDifference={submissionDifference} />}
    </div>
  );
};

const BadgeDay = ({ submissionDifference }: { submissionDifference: number }) => {
  const getBadgeVariant = () => {
    if (submissionDifference > 0) return "success";
    if (submissionDifference < 0) return "destructive";
    return "info";
  };

  const getBadgeText = () => {
    if (submissionDifference > 0) {
      return `+${submissionDifference} submission${submissionDifference > 1 ? "s" : ""} compared to yesterday`;
    } else if (submissionDifference < 0) {
      return `${submissionDifference} submission${submissionDifference < -1 ? "s" : ""} compared to yesterday`;
    }
    return "No change in submissions compared to yesterday";
  };

  const renderIcon = () => {
    if (submissionDifference > 0) {
      return <TrendingUpIcon className="text-success w-4 h-4" />;
    } else if (submissionDifference < 0) {
      return <TrendingDownIcon className="text-destructive w-4 h-4" />;
    }
    return null;
  };

  return (
    <Badge variant={getBadgeVariant()} className="flex items-center gap-2 justify-center sm:justify-start">
      {renderIcon()}
      {getBadgeText()}
    </Badge>
  );
};

export default FormSubmissionsActivityChart;
