import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useFormStore from "@/stores/form";
import { formatDecimal } from "@/utils/functions";
import { BirdIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

const CompletionRateChart = () => {
  const {
    formAnalytics: { total_submissions, total_views, avg_completion_rate },
  } = useFormStore();
  const hasData = total_views > 0;
  const avgCompletionRate = `${formatDecimal(avg_completion_rate ?? 0)}%`;
  const chartData = [
    {
      segment: "views",
      total: total_views,
      fill: "#7C3AED",
    },
    {
      segment: "submissions",
      total: total_submissions,
      fill: "#CAB0f7",
    },
  ];
  const chartConfig = {
    total: {
      label: "Segments",
    },
    views: {
      label: "Views",
      color: "hsl(var(--chart-1))",
    },
    submissions: {
      label: "Submissions",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col justify-center items-center sm:items-start">
        <div className="flex justify-center items-center gap-4">
          <CardTitle>Completion Rate</CardTitle>
          <Badge variant={"lime"}>All time</Badge>
        </div>
        <CardDescription>
          Visual representation of form views and submissions, helping you
          analyze engagement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData && (
          <div className="flex flex-col items-center text-center text-muted-foreground gap-3 py-10">
            <div className="flex justify-center items-center p-2 rounded bg-warning/10">
              <BirdIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="text-lg font-semibold text-foreground">
                No data available
              </p>
              <p className="text-sm text-muted-foreground">
                Your form hasn’t received any views yet.
              </p>
            </div>
          </div>
        )}
        {hasData && (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="segment"
                innerRadius={60}
                strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold">
                            {avgCompletionRate}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground">
                            Completion Rate
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      {hasData && (
        <CardFooter className="flex sm:justify-start justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-2">
            <div className="w-3 h-3 bg-[#7C3AED] rounded"></div>
            <span className="text-sm text-foreground/80">Views</span>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="w-3 h-3 bg-[#CAB0f7] rounded"></div>
            <span className="text-sm text-foreground/80">Submissions</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CompletionRateChart;
