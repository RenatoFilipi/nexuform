import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useGlobalStore from "@/stores/global";
import { minWidth640 } from "@/utils/constants";
import { format, parseISO, subDays } from "date-fns";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useMedia } from "react-use";
import { CartesianGrid, ComposedChart, Legend, Line, XAxis } from "recharts";
import { CurveType } from "recharts/types/shape/Curve";

interface IChartData {
  day: string;
  submissions: number;
  views: number;
}
const CHART_CONFIG: ChartConfig = {
  submissions: {
    label: "Submissions",
    color: "#ffa500",
  },
  views: {
    label: "Views",
    color: "#51A2FF",
  },
} as ChartConfig;

type HasDataAction = { type: "CHECK_DATA"; payload: IChartData[] };

const hasDataReducer = (state: boolean, action: HasDataAction): boolean => {
  switch (action.type) {
    case "CHECK_DATA":
      return action.payload.some((item) => item.submissions > 0 || item.views > 0);
    default:
      return state;
  }
};
const FormSubmissionsActivityChart = () => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const global = useGlobalStore();
  const [days, setDays] = useState<number>(7);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const curveType: CurveType = "linear";
  const subKey = t("label_submissions");
  const viewKey = t("label_views");
  const options = [
    { label: `7 ${t("label_days")}`, value: 7 },
    { label: `30 ${t("label_days")}`, value: 30 },
  ];
  const lastNDays = useMemo<IChartData[]>(
    () =>
      Array.from({ length: days }, (_, i) => ({
        day: format(subDays(new Date(), i), "dd/MM"),
        submissions: 0,
        views: 0,
      })).reverse(),
    [days]
  );

  useEffect(() => {
    if (!global.submissionLogs || !global.viewLogs) return;

    const submissionCount: Record<string, number> = {};
    const viewCount: Record<string, number> = {};

    // Count submissions per day
    global.submissionLogs.forEach((log) => {
      if (!log?.created_at) return;
      const day = format(parseISO(log.created_at), "dd/MM");
      submissionCount[day] = (submissionCount[day] || 0) + 1;
    });

    // Count views per day
    global.viewLogs.forEach((log) => {
      if (!log?.created_at) return;
      const day = format(parseISO(log.created_at), "dd/MM");
      viewCount[day] = (viewCount[day] || 0) + 1;
    });

    const updatedChartData = lastNDays.map((data) => ({
      ...data,
      submissions: submissionCount[data.day] || 0,
      views: viewCount[data.day] || 0,
    }));

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [global.submissionLogs, global.viewLogs, lastNDays]);

  const todaySubmissions = chartData.find((data) => data.day === format(new Date(), "dd/MM"))?.submissions || 0;
  const yesterdaySubmissions =
    chartData.find((data) => data.day === format(subDays(new Date(), 1), "dd/MM"))?.submissions || 0;
  const submissionDifference = todaySubmissions - yesterdaySubmissions;

  return (
    <div className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit">
      <div className="flex flex-col justify-center items-center sm:items-start">
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex justify-center items-center gap-3">
            {options.map((opt) => (
              <Button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                variant="outline"
                size="xs"
                className={days === opt.value ? "bg-foreground/10" : ""}>
                {opt.label}
              </Button>
            ))}
          </div>
          {hasData && isDesktop && <BadgeDay submissionDifference={submissionDifference} />}
          {!hasData && <Badge variant="warning">{t("label_no_data")}</Badge>}
        </div>
      </div>
      <ChartContainer config={CHART_CONFIG} className="sm:max-h-[280px]">
        <ComposedChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              return <span className="text-sm text-muted-foreground">{value}</span>;
            }}
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
          <Line
            name={viewKey}
            type={curveType}
            dataKey="views"
            stroke="#51A2FF"
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 6 }}
            animationDuration={300}
          />
          <Line
            name={subKey}
            type={curveType}
            dataKey="submissions"
            stroke="#ffa500"
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 6 }}
            animationDuration={300}
          />
        </ComposedChart>
      </ChartContainer>
      {hasData && !isDesktop && <BadgeDay submissionDifference={submissionDifference} />}
    </div>
  );
};

const BadgeDay = ({ submissionDifference }: { submissionDifference: number }) => {
  const t = useTranslations("app");

  const getBadgeVariant = () => {
    if (submissionDifference > 0) return "success";
    if (submissionDifference < 0) return "destructive";
    return "primary";
  };

  const getBadgeText = () => {
    if (submissionDifference !== 0) {
      return `${submissionDifference > 0 ? "+" : ""} ${submissionDifference} ${
        submissionDifference === 1 ? t("label_submission") : t("label_submissions")
      }`;
    }
    return t("label_no_submissions_change");
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
