import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useGlobalStore from "@/stores/global";
import { fallbackColor } from "@/utils/constants";
import { generateDistinctColors } from "@/utils/functions";
import { format, subDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface IChartData {
  day: string;
  [key: string]: string | number;
}

const CHART_CONFIG: ChartConfig = {} as ChartConfig;

const AnalyticsSubmissionsActivityChart = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const [days, setDays] = useState<number>(7);

  const options = [
    { label: `7 ${t("label_days")}`, value: 7 },
    { label: `30 ${t("label_days")}`, value: 30 },
  ];

  const lastNDays = useMemo<IChartData[]>(
    () =>
      Array.from({ length: days }, (_, i) => ({
        day: format(subDays(new Date(), i), "dd/MM"),
      })).reverse(),
    [days]
  );

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
      const date = format(new Date(created_at), "dd/MM");
      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][form_id]) grouped[date][form_id] = 0;
      grouped[date][form_id] += 1;
    });

    return lastNDays.map((day) => {
      const entry: IChartData = { day: day.day };
      formIds.forEach((formId) => {
        entry[formMap[formId] || formId] = grouped[day.day]?.[formId] || 0;
      });
      return entry;
    });
  }, [global.submissionLogs, lastNDays, formIds, formMap]);

  const getColor = (index: number) => colors[index % colors.length];

  const CustomTooltipContent = (props: any) => {
    const { payload, label } = props;
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
