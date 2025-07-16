"use client";

import { Card } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useAppStore from "@/stores/app";
import { getDateDifferenceInDays } from "@/utils/functions";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { CurveType } from "recharts/types/shape/Curve";

interface IChartData {
  day: string;
  [formId: string]: number | string;
}

type HasDataAction = { type: "CHECK_DATA"; payload: IChartData[] };

const hasDataReducer = (state: boolean, action: HasDataAction): boolean => {
  switch (action.type) {
    case "CHECK_DATA":
      return action.payload.some((item) => Object.keys(item).some((key) => key !== "day" && Number(item[key]) > 0));
    default:
      return state;
  }
};

const AnalyticsSubmissionsByFormChart = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const curveType: CurveType = "basis";

  const dateRange = useMemo(() => {
    const daysCount = getDateDifferenceInDays(app.from, app.to);
    return Array.from({ length: daysCount }, (_, i) => {
      const date = addDays(app.from, i);
      const dayEntry: IChartData = { day: format(date, "dd/MM") };

      // Initialize all forms with 0 submissions
      app.forms?.forEach((form) => {
        dayEntry[form.id] = 0;
      });

      return dayEntry;
    });
  }, [app.from, app.to, app.forms]);

  useEffect(() => {
    if (!app.submissionLogs || !app.forms) return;

    // Create a count object for each form
    const formCounts: Record<string, Record<string, number>> = {};
    app.forms.forEach((form) => {
      formCounts[form.id] = {};
    });

    // Count submissions per form per day
    app.submissionLogs.forEach((log) => {
      if (!log?.created_at) return;
      const logDate = parseISO(log.created_at);
      if (isWithinInterval(logDate, { start: app.from, end: app.to })) {
        const day = format(logDate, "dd/MM");
        formCounts[log.form_id][day] = (formCounts[log.form_id][day] || 0) + 1;
      }
    });

    // Update chart data with the counts
    const updatedChartData = dateRange.map((dayData) => {
      const newDayData = { ...dayData };
      app.forms?.forEach((form) => {
        newDayData[form.id] = formCounts[form.id][dayData.day] || 0;
      });
      return newDayData;
    });

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [app.submissionLogs, app.forms, dateRange, app.from, app.to]);

  // Create chart config based on forms
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    app.forms?.forEach((form) => {
      config[form.id] = {
        label: form.name,
        color: form.label_color,
      };
    });
    return config;
  }, [app.forms]);

  if (!hasData || !app.forms?.length) {
    return (
      <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit">
        <div className="flex justify-center items-center h-[280px]">
          <p className="text-muted-foreground">{t("label_no_data")}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-base">{t("label_submissions_by_form")}</span>
        <div className="justify-center items-center gap-4 hidden sm:flex">
          {app.forms?.map((form) => (
            <div key={form.id} className="flex justify-center items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: form.label_color }}></div>
              <span className="text-sm text-muted-foreground">{form.name}</span>
            </div>
          ))}
        </div>
      </div>
      <ChartContainer config={chartConfig} className="sm:max-h-[280px]">
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
          {app.forms?.map((form) => (
            <Area
              key={form.id}
              dataKey={form.id}
              type={curveType}
              fill={form.label_color}
              fillOpacity={0.4}
              stroke={form.label_color}
              strokeWidth={2}
              stackId={form.id}
              name={form.name}
            />
          ))}
          <ChartLegend className="flex sm:hidden" content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
};

export default AnalyticsSubmissionsByFormChart;
