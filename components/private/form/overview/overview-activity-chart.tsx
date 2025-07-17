"use client";

import { Card } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAppStore from "@/stores/app";
import { getDateDifferenceInDays } from "@/utils/functions";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { CurveType } from "recharts/types/shape/Curve";

const submissionColor = "#3232d6";
const viewColor = "#ffa500";

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
  const app = useAppStore();
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const curveType: CurveType = "linear";
  const subKey = t("label_submissions");
  const viewKey = t("label_views");

  const dateRange = useMemo(() => {
    const daysCount = getDateDifferenceInDays(app.from, app.to);
    return Array.from({ length: daysCount }, (_, i) => {
      const date = addDays(app.from, i);
      return {
        day: format(date, "dd/MM"),
        submissions: 0,
        views: 0,
      };
    });
  }, [app.from, app.to]);

  useEffect(() => {
    if (!app.submissionLogs || !app.viewLogs) return;

    const submissionCount: Record<string, number> = {};
    const viewCount: Record<string, number> = {};

    // Count submissions per day within the date range
    app.submissionLogs.forEach((log) => {
      if (!log?.created_at) return;
      const logDate = parseISO(log.created_at);
      if (isWithinInterval(logDate, { start: app.from, end: app.to })) {
        const day = format(logDate, "dd/MM");
        submissionCount[day] = (submissionCount[day] || 0) + 1;
      }
    });

    // Count views per day within the date range
    app.viewLogs.forEach((log) => {
      if (!log?.created_at) return;
      const logDate = parseISO(log.created_at);
      if (isWithinInterval(logDate, { start: app.from, end: app.to })) {
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
  }, [app.submissionLogs, app.viewLogs, dateRange, app.from, app.to]);

  const legends = [
    { color: submissionColor, name: subKey },
    { color: viewColor, name: viewKey },
  ];

  return (
    <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit">
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
      <ChartContainer config={CHART_CONFIG} className="sm:max-h-[400px]">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
          <defs>
            <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={submissionColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={submissionColor} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={viewColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={viewColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            name={viewKey}
            type={curveType}
            dataKey="views"
            fill="url(#fillViews)"
            fillOpacity={0.4}
            stroke={viewColor}
            strokeWidth={2}
            animationDuration={300}
          />
          <Area
            name={subKey}
            type={curveType}
            dataKey="submissions"
            fill="url(#fillSubmissions)"
            fillOpacity={0.4}
            stroke={submissionColor}
            strokeWidth={2}
            animationDuration={300}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
};

export default OverviewActivityChart;
