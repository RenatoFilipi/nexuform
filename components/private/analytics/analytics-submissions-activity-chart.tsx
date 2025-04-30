import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAnalyticsStore from "@/stores/analytics";
import { format, subDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface IChartData {
  day: string;
  [key: string]: string | number;
}

const CHART_CONFIG: ChartConfig = {} as ChartConfig;

const colors = [
  "hsl(259, 78%, 58%)",
  "hsl(265, 80%, 50%)",
  "hsl(270, 75%, 45%)",
  "hsl(275, 85%, 65%)",
  "hsl(280, 70%, 55%)",
  "hsl(285, 60%, 40%)",
  "hsl(290, 75%, 60%)",
  "hsl(295, 85%, 70%)",
  "hsl(300, 65%, 50%)",
  "hsl(305, 80%, 55%)",
];

const AnalyticsSubmissionsActivityChart = () => {
  const t = useTranslations("app");
  const { submissions, forms } = useAnalyticsStore();
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
    return forms.reduce((acc, form) => {
      acc[form.id] = form.name;
      return acc;
    }, {} as Record<string, string>);
  }, [forms]);

  const formIds = useMemo(() => forms.map((f) => f.id), [forms]);

  const data = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    submissions.forEach(({ created_at, form_id }) => {
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
  }, [submissions, lastNDays, formIds, formMap]);

  const getColor = (index: number) => {
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col gap-4 border rounded p-4">
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
          <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
          {formIds.map((formId, index) => (
            <Line
              key={formId}
              type="linear"
              animationDuration={300}
              dataKey={formMap[formId] || formId}
              stroke={getColor(index)}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default AnalyticsSubmissionsActivityChart;
