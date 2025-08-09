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
import { ChartNoAxesColumnIcon } from "lucide-react";
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

const AnalyticsSubmissionsByFormChart = ({ ids }: { ids: string[] }) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const curveType: CurveType = "linear";

  // Filtrar os forms pelos IDs fornecidos
  const filteredForms = useMemo(() => {
    return app.forms.filter((form) => ids.includes(form.id)) || [];
  }, [app.forms, ids]);

  const dateRange = useMemo(() => {
    const daysCount = getDateDifferenceInDays(app.from, app.to);
    return Array.from({ length: daysCount }, (_, i) => {
      const date = addDays(app.from, i);
      const dayEntry: IChartData = { day: format(date, "dd/MM") };

      // Inicializar apenas os forms filtrados com 0 submissões
      filteredForms.forEach((form) => {
        dayEntry[form.id] = 0;
      });

      return dayEntry;
    });
  }, [app.from, app.to, filteredForms]);

  useEffect(() => {
    if (!app.submissionLogs || !filteredForms.length) return;

    // Criar um objeto de contagem para cada form filtrado
    const formCounts: Record<string, Record<string, number>> = {};
    filteredForms.forEach((form) => {
      formCounts[form.id] = {};
    });

    // Contar submissões por form por dia (apenas para forms filtrados)
    app.submissionLogs.forEach((log) => {
      if (!log?.created_at || !ids.includes(log.form_id)) return;
      const logDate = parseISO(log.created_at);
      if (isWithinInterval(logDate, { start: app.from, end: app.to })) {
        const day = format(logDate, "dd/MM");
        formCounts[log.form_id][day] = (formCounts[log.form_id][day] || 0) + 1;
      }
    });

    // Atualizar dados do gráfico com as contagens
    const updatedChartData = dateRange.map((dayData) => {
      const newDayData = { ...dayData };
      filteredForms.forEach((form) => {
        newDayData[form.id] = formCounts[form.id][dayData.day] || 0;
      });
      return newDayData;
    });

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [app.submissionLogs, filteredForms, dateRange, app.from, app.to, ids]);

  // Criar configuração do gráfico baseada nos forms filtrados
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
      <Card className="flex flex-col justify-between gap-4 relative border w-full p-6 h-fit">
        <div className="flex items-center gap-2">
          <ChartNoAxesColumnIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">{t("label_submissions_by_form")}</span>
        </div>
        <div className="flex justify-center items-center h-[400px]">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="flex justify-center items-center p-2 w-fit rounded bg-foreground/5">
              <ChartNoAxesColumnIcon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground">{t("label_no_data")}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col justify-between gap-4 relative border rounded w-full p-6 h-fit hover:border-primary/50 transition-all duration-300 hover:shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChartNoAxesColumnIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">{t("label_submissions_by_form")}</span>
        </div>
        <div className="justify-center items-center gap-4 hidden">
          {filteredForms.map((form) => (
            <div key={form.id} className="flex justify-center items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: form.label_color }}></div>
              <span className="text-sm text-muted-foreground">{form.name}</span>
            </div>
          ))}
        </div>
      </div>
      <ChartContainer config={chartConfig} className="sm:max-h-[400px]">
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
            {filteredForms.map((form) => (
              <linearGradient key={form.id} id={`fill-${form.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={form.label_color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={form.label_color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          {filteredForms.map((form) => (
            <Area
              key={form.id}
              dataKey={form.id}
              type={curveType}
              fill={`url(#fill-${form.id})`}
              fillOpacity={0.4}
              stroke={form.label_color}
              strokeWidth={2}
              stackId={form.id}
              name={form.name}
              animationDuration={300}
            />
          ))}
          <ChartLegend className="mt-2" content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
};

export default AnalyticsSubmissionsByFormChart;
