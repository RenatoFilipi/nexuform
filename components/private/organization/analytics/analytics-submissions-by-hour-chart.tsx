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
import { parseISO } from "date-fns";
import { TrendingUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useReducer, useState } from "react";
import { CartesianGrid, XAxis, Line, LineChart, TooltipProps } from "recharts";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface IChartData {
  hour: string;
  [formId: string]: number | string;
}

type HoursView = "24h" | "work" | "12h";

type HasDataAction = { type: "CHECK_DATA"; payload: IChartData[] };

const hasDataReducer = (state: boolean, action: HasDataAction): boolean => {
  switch (action.type) {
    case "CHECK_DATA":
      return action.payload.some((item) => Object.keys(item).some((key) => key !== "hour" && Number(item[key]) > 0));
    default:
      return state;
  }
};

const AnalyticsSubmissionsByHourChart = ({ ids }: { ids: string[] }) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const [hoursView, setHoursView] = useState<HoursView>("24h");
  const { resolvedTheme } = useTheme();

  const buttonsSet: { label: string; type: HoursView; enabled: boolean }[] = [
    { label: "24h", type: "24h", enabled: true },
    { label: "12h", type: "12h", enabled: true },
    { label: "9-17h", type: "work", enabled: false },
  ];

  const filteredForms = useMemo(() => {
    return app.forms.filter((form) => ids.includes(form.id)) || [];
  }, [app.forms, ids]);

  const hourRange24 = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hourLabel = String(i).padStart(2, "0") + ":00";
      const hourEntry: IChartData = { hour: hourLabel };
      filteredForms.forEach((form) => {
        hourEntry[form.id] = 0;
      });
      return hourEntry;
    });
  }, [filteredForms]);

  const hourRange12 = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8;
      const hourLabel = String(hour).padStart(2, "0") + ":00";
      const hourEntry: IChartData = { hour: hourLabel };
      filteredForms.forEach((form) => {
        hourEntry[form.id] = 0;
      });
      return hourEntry;
    });
  }, [filteredForms]);

  const hourRangeWork = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => {
      const hour = i + 9;
      const hourLabel = String(hour).padStart(2, "0") + ":00";
      const hourEntry: IChartData = { hour: hourLabel };
      filteredForms.forEach((form) => {
        hourEntry[form.id] = 0;
      });
      return hourEntry;
    });
  }, [filteredForms]);

  const currentHourRange = useMemo(() => {
    switch (hoursView) {
      case "work":
        return hourRangeWork;
      case "12h":
        return hourRange12;
      case "24h":
      default:
        return hourRange24;
    }
  }, [hoursView, hourRange24, hourRangeWork, hourRange12]);

  useEffect(() => {
    if (!app.submissionLogs || !filteredForms.length) return;

    const formCounts: Record<string, Record<string, number>> = {};
    filteredForms.forEach((form) => {
      formCounts[form.id] = {};
    });

    app.submissionLogs.forEach((log) => {
      if (!log?.created_at || !ids.includes(log.form_id)) return;
      const logDate = parseISO(log.created_at);
      const hour = String(logDate.getHours()).padStart(2, "0") + ":00";
      formCounts[log.form_id][hour] = (formCounts[log.form_id][hour] || 0) + 1;
    });

    const updatedChartData = currentHourRange.map((hourData) => {
      const newHourData = { ...hourData };
      filteredForms.forEach((form) => {
        newHourData[form.id] = formCounts[form.id][hourData.hour] || 0;
      });
      return newHourData;
    });

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [app.submissionLogs, filteredForms, currentHourRange, ids]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    filteredForms.forEach((form) => {
      config[form.id] = {
        label: form.name,
        color: form.label_color,
      };
    });
    return config;
  }, [filteredForms]);

  if (!hasData || !filteredForms.length) {
    return (
      <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit hover:border-primary transition-all duration-300 hover:shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUpDownIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">{t("label_submissions_by_hour")}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("desc_submissions_by_hour")}</p>
        </div>
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="flex justify-center items-center p-2 w-fit rounded bg-foreground/5">
              <TrendingUpDownIcon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground">{t("label_no_data")}</p>
          </div>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...chartData.flatMap((item) => filteredForms.map((form) => Number(item[form.id] || 0))));

  return (
    <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit hover:border-primary transition-all duration-300 hover:shadow-sm">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUpDownIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">{t("label_submissions_by_hour")}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("desc_submissions_by_hour")}</p>
        </div>
        <div className="flex gap-2">
          {buttonsSet
            .filter((x) => x.enabled)
            .map((x) => (
              <Button
                variant={"outline"}
                size={"sm"}
                key={x.type}
                onClick={() => setHoursView(x.type)}
                className={`${
                  hoursView === x.type ? "bg-foreground/15" : "bg-transparent"
                } flex justify-center items-center gap-2`}>
                <div
                  className={`${hoursView === x.type ? "bg-primary" : "bg-foreground/15"} w-2 h-2 rounded-full`}></div>
                <span className={`${hoursView === x.type ? "text-foreground" : "text-foreground/70"}`}>{x.label}</span>
              </Button>
            ))}
        </div>
      </div>
      <ChartContainer config={chartConfig} className="sm:max-h-[400px]">
        <LineChart
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
          {filteredForms.map((form) => (
            <Line
              key={form.id}
              type="linear"
              dataKey={form.id}
              stroke={form.label_color}
              strokeWidth={2}
              name={form.name}
              animationDuration={300}
            />
          ))}
          <ChartLegend className="mt-2" content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </Card>
  );
};

export default AnalyticsSubmissionsByHourChart;
