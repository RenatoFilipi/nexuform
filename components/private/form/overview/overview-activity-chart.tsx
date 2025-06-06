import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useGlobalStore from "@/stores/global";
import { getDateDifferenceInDays } from "@/utils/functions";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useReducer, useState } from "react";
import { CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import { CurveType } from "recharts/types/shape/Curve";

const submissionColor = "#38bdf8";
const viewColor = "#fb923c";

interface IChartData {
  day: string;
  submissions: number;
  views: number;
}
const CHART_CONFIG: ChartConfig = {
  submissions: {
    label: "Submissions",
    color: submissionColor,
  },
  views: {
    label: "Views",
    color: viewColor,
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

const OverviewActivityChart = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const curveType: CurveType = "linear";
  const subKey = t("label_submissions");
  const viewKey = t("label_views");

  // Generate date range based on initDate and finalDate
  const dateRange = useMemo(() => {
    const daysCount = getDateDifferenceInDays(global.from, global.to);
    return Array.from({ length: daysCount }, (_, i) => {
      const date = addDays(global.from, i);
      return {
        day: format(date, "dd/MM"),
        submissions: 0,
        views: 0,
      };
    });
  }, [global.from, global.to]);

  useEffect(() => {
    if (!global.submissionLogs || !global.viewLogs) return;

    const submissionCount: Record<string, number> = {};
    const viewCount: Record<string, number> = {};

    // Count submissions per day within the date range
    global.submissionLogs.forEach((log) => {
      if (!log?.created_at) return;
      const logDate = parseISO(log.created_at);
      if (isWithinInterval(logDate, { start: global.from, end: global.to })) {
        const day = format(logDate, "dd/MM");
        submissionCount[day] = (submissionCount[day] || 0) + 1;
      }
    });

    // Count views per day within the date range
    global.viewLogs.forEach((log) => {
      if (!log?.created_at) return;
      const logDate = parseISO(log.created_at);
      if (isWithinInterval(logDate, { start: global.from, end: global.to })) {
        const day = format(logDate, "dd/MM");
        viewCount[day] = (viewCount[day] || 0) + 1;
      }
    });

    const updatedChartData = dateRange.map((data) => ({
      ...data,
      submissions: submissionCount[data.day] || 0,
      views: viewCount[data.day] || 0,
    }));

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [global.submissionLogs, global.viewLogs, dateRange, global.from, global.to]);

  const legends = [
    { color: submissionColor, name: subKey },
    { color: viewColor, name: viewKey },
  ];

  return (
    <div className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          <span className="font-semibold text-base">{t("label_activity")}</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          {legends.map((l) => {
            return (
              <div key={l.name} className="flex justify-center items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }}></div>
                <span className="text-sm text-muted-foreground">{l.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <ChartContainer config={CHART_CONFIG} className="sm:max-h-[280px]">
        <ComposedChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={true}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
          <Line
            name={viewKey}
            type={curveType}
            dataKey="views"
            stroke={viewColor}
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 6 }}
            animationDuration={300}
          />
          <Line
            name={subKey}
            type={curveType}
            dataKey="submissions"
            stroke={submissionColor}
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 6 }}
            animationDuration={300}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
};

export default OverviewActivityChart;
