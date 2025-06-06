import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useGlobalStore from "@/stores/global";
import { fallbackColor } from "@/utils/constants";
import { generateDistinctColors, getDateDifferenceInDays } from "@/utils/functions";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo, useReducer } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface IChartData {
  day: string;
  [key: string]: string | number;
}

const CHART_CONFIG: ChartConfig = {} as ChartConfig;

type HasDataAction = { type: "CHECK_DATA"; payload: IChartData[] };

const hasDataReducer = (state: boolean, action: HasDataAction): boolean => {
  switch (action.type) {
    case "CHECK_DATA":
      return action.payload.some((item) => {
        return Object.keys(item).some((key) => key !== "day" && Number(item[key]) > 0);
      });
    default:
      return state;
  }
};

const AnalyticsSubmissionsActivityChart = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const [hasData, dispatch] = useReducer(hasDataReducer, false);

  // Generate date range based on global.from and global.to
  const dateRange = useMemo(() => {
    const daysCount = getDateDifferenceInDays(global.from, global.to);
    return Array.from({ length: daysCount }, (_, i) => {
      const date = addDays(global.from, i);
      return {
        day: format(date, "dd/MM"),
      };
    });
  }, [global.from, global.to]);

  const formMap = useMemo(() => {
    return global.forms.reduce((acc, form) => {
      acc[form.id] = form.name;
      return acc;
    }, {} as Record<string, string>);
  }, [global.forms]);

  const formIds = useMemo(() => global.forms.map((f) => f.id), [global.forms]);

  const colors = useMemo(() => generateDistinctColors(fallbackColor, formIds.length), [formIds.length]);

  const data = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    global.submissionLogs.forEach(({ created_at, form_id }) => {
      const logDate = parseISO(created_at);
      if (isWithinInterval(logDate, { start: global.from, end: global.to })) {
        const day = format(logDate, "dd/MM");
        if (!grouped[day]) grouped[day] = {};
        if (!grouped[day][form_id]) grouped[day][form_id] = 0;
        grouped[day][form_id] += 1;
      }
    });

    const chartData = dateRange.map((dayObj) => {
      const entry: IChartData = { day: dayObj.day };
      formIds.forEach((formId) => {
        entry[formMap[formId] || formId] = grouped[dayObj.day]?.[formId] || 0;
      });
      return entry;
    });

    dispatch({ type: "CHECK_DATA", payload: chartData });
    return chartData;
  }, [global.submissionLogs, dateRange, formIds, formMap, global.from, global.to]);

  const getColor = (index: number) => colors[index % colors.length];

  const CustomTooltipContent = (props: any) => {
    return (
      <ChartTooltipContent
        {...props}
        indicator="dot"
        formatter={(value: any, name: any, item: any) => {
          const index = formIds.findIndex((id) => formMap[id] === name || id === name);
          return [
            value,
            <span key={name} style={{ color: getColor(index) }}>
              {name}
            </span>,
          ];
        }}
        labelFormatter={(label) => label}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 border rounded p-4 h-fit">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">{t("label_activity")}</span>
      </div>
      <ChartContainer config={CHART_CONFIG} className="">
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 5)}
          />
          <ChartTooltip cursor={true} content={<CustomTooltipContent />} />
          {formIds.map((formId, index) => (
            <Line
              key={formId}
              type="linear"
              animationDuration={300}
              dataKey={formMap[formId] || formId}
              stroke={getColor(index)}
              strokeWidth={2}
              dot={{ r: 3, fill: getColor(index) }}
              activeDot={{ r: 5, fill: getColor(index) }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default AnalyticsSubmissionsActivityChart;
