"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useGlobalStore from "@/stores/global";
import { fallbackColor, minWidth640 } from "@/utils/constants";
import { format, isAfter, parseISO, subDays } from "date-fns";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useMedia } from "react-use";
import { CartesianGrid, ComposedChart, Legend, Line, XAxis } from "recharts";
import { CurveType } from "recharts/types/shape/Curve";

const conversionColor = fallbackColor;

interface IChartData {
  day: string;
  conversionRate: number;
}

const CHART_CONFIG: ChartConfig = {
  conversionRate: {
    label: "Conversion Rate",
    color: conversionColor,
  },
} as ChartConfig;

type HasDataAction = { type: "CHECK_DATA"; payload: IChartData[] };

const hasDataReducer = (state: boolean, action: HasDataAction): boolean => {
  switch (action.type) {
    case "CHECK_DATA":
      return action.payload.some((item) => item.conversionRate > 0);
    default:
      return state;
  }
};

const OverviewConversionRateChart = () => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const global = useGlobalStore();
  const [days, setDays] = useState<number>(7);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const [hasData, dispatch] = useReducer(hasDataReducer, false);
  const curveType: CurveType = "linear";
  const conversionKey = t("label_conversion_rate");

  const options = [
    { label: `7 ${t("label_days")}`, value: 7 },
    { label: `30 ${t("label_days")}`, value: 30 },
  ];

  const lastNDays = useMemo<IChartData[]>(
    () =>
      Array.from({ length: days }, (_, i) => ({
        day: format(subDays(new Date(), i), "dd/MM"),
        conversionRate: 0,
      })).reverse(),
    [days]
  );

  useEffect(() => {
    if (!global.submissionLogs || !global.viewLogs) return;

    const viewCount: Record<string, number> = {};
    const submissionCount: Record<string, number> = {};

    const cutoffDate = subDays(new Date(), days);

    // Count views per day
    global.viewLogs.forEach((log) => {
      if (!log?.created_at) return;
      const dateObj = parseISO(log.created_at);
      if (isAfter(dateObj, cutoffDate)) {
        const day = format(dateObj, "dd/MM");
        viewCount[day] = (viewCount[day] || 0) + 1;
      }
    });

    // Count submissions per day
    global.submissionLogs.forEach((log) => {
      if (!log?.created_at) return;
      const dateObj = parseISO(log.created_at);
      if (isAfter(dateObj, cutoffDate)) {
        const day = format(dateObj, "dd/MM");
        submissionCount[day] = (submissionCount[day] || 0) + 1;
      }
    });

    const updatedChartData = lastNDays.map((data) => {
      const views = viewCount[data.day] || 0;
      const submissions = submissionCount[data.day] || 0;
      const conversionRate = views > 0 ? (submissions / views) * 100 : 0;

      return {
        ...data,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      };
    });

    setChartData(updatedChartData);
    dispatch({ type: "CHECK_DATA", payload: updatedChartData });
  }, [global.submissionLogs, global.viewLogs, lastNDays, days]);

  const todayConversion = chartData.find((data) => data.day === format(new Date(), "dd/MM"))?.conversionRate || 0;
  const yesterdayConversion =
    chartData.find((data) => data.day === format(subDays(new Date(), 1), "dd/MM"))?.conversionRate || 0;
  const conversionDifference = todayConversion - yesterdayConversion;

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
          {hasData && isDesktop && <BadgeDay conversionDifference={conversionDifference} />}
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
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent indicator="dot" formatter={(value) => `${value}%`} />}
          />
          <Line
            name={conversionKey}
            type={curveType}
            dataKey="conversionRate"
            stroke={conversionColor}
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 6 }}
            animationDuration={300}
          />
        </ComposedChart>
      </ChartContainer>
      {hasData && !isDesktop && <BadgeDay conversionDifference={conversionDifference} />}
    </div>
  );
};

const BadgeDay = ({ conversionDifference }: { conversionDifference: number }) => {
  const t = useTranslations("app");

  const getBadgeVariant = () => {
    if (conversionDifference > 0) return "success";
    if (conversionDifference < 0) return "destructive";
    return "primary";
  };

  const getBadgeText = () => {
    if (conversionDifference !== 0) {
      return `${conversionDifference > 0 ? "+" : ""}${conversionDifference.toFixed(2)}% ${t("label_change")}`;
    }
    return t("label_no_change");
  };

  const renderIcon = () => {
    if (conversionDifference > 0) {
      return <TrendingUpIcon className="text-success w-4 h-4" />;
    } else if (conversionDifference < 0) {
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

export default OverviewConversionRateChart;
