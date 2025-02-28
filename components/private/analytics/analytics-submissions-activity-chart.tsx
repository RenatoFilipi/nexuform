import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useAnalyticsStore from "@/stores/analytics";
import { format, subDays } from "date-fns";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface IChartData {
  day: string;
  [key: string]: string | number;
}

const OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
] as const;

const CHART_CONFIG: ChartConfig = {} as ChartConfig;

const blueColors = [
  "hsl(220, 70%, 50%)",
  "hsl(173, 58%, 39%)",
  "hsl(197, 37%, 24%)",
  "hsl(43, 74%, 66%)",
  "hsl(27, 87%, 67%)",
  "hsl(210, 60%, 40%)",
  "hsl(190, 50%, 45%)",
  "hsl(240, 70%, 35%)",
  "hsl(180, 80%, 50%)",
  "hsl(230, 65%, 55%)",
];

const AnalyticsSubmissionsActivityChart = () => {
  const { submissions, forms } = useAnalyticsStore();
  const [days, setDays] = useState<number>(7);

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
    return blueColors[index % blueColors.length];
  };

  return (
    <div className="border flex flex-col gap-4 p-4 rounded">
      <div className="flex justify-between items-center">
        <span>Activity</span>
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
              strokeWidth={3}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default AnalyticsSubmissionsActivityChart;
