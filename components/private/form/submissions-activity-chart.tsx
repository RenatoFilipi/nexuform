import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useFormStore from "@/stores/form";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import { BirdIcon } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const options = [
  { label: "24 hours", value: 1 },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
];

const SubmissionsActivityChart = () => {
  const { overviewSubmissions } = useFormStore();
  const [days, setDays] = useState(7);
  const hasData = overviewSubmissions.length > 0;
  const [chartData, setChartData] = useState<
    { day: string; submission: number }[]
  >([]);

  useQuery({
    queryKey: ["formOverviewChartData"],
    queryFn: () => {
      const lastNDays = Array.from({ length: days }, (_, i) => ({
        day: format(subDays(new Date(), i), "dd/MM"),
        submission: 0,
      })).reverse();
      const submissionCount: Record<string, number> = {};
      overviewSubmissions.forEach((submission) => {
        const day = format(parseISO(submission.created_at), "dd/MM");
        submissionCount[day] = (submissionCount[day] || 0) + 1;
      });
      const updatedChartData = lastNDays.map((data) => ({
        ...data,
        submission: submissionCount[data.day] || 0,
      }));
      setChartData(updatedChartData);

      return null;
    },
    refetchOnWindowFocus: false,
  });

  const chartConfig = {
    submission: {
      label: "Submission",
      color: "#7C3AED",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col border py-3 px-4 rounded gap-3">
      <div className="flex flex-col justify-center items-center sm:items-start">
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex justify-center items-center gap-3">
            {options.map((opt, i) => {
              return (
                <Button
                  key={i}
                  onClick={() => {
                    if (days !== opt.value) setDays(opt.value);
                  }}
                  variant={"outline"}
                  size={"xs"}
                  className={`${days === opt.value && "bg-foreground/5"}`}>
                  {opt.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
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
              Your form has no submission to show.
            </p>
          </div>
        </div>
      )}
      {hasData && (
        <div>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 5)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                barSize={20}
                dataKey="submission"
                fill="var(--color-submission)"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};

export default SubmissionsActivityChart;
