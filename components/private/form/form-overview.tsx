"use client";

import { Card } from "@/components/ui/card";
import useFormStore from "@/stores/form";
import { formatDecimal, formatTime } from "@/utils/functions";
import { CheckCircleIcon, EyeIcon, SendIcon, TimerIcon } from "lucide-react";
import SubmissionsActivityChart from "./submissions-activity-chart";

const FormOverview = () => {
  const { formAnalytics } = useFormStore();

  const {
    total_submissions,
    total_views,
    avg_completion_rate,
    avg_completion_time,
  } = formAnalytics;

  const totalViews = total_views === 0 ? "--" : total_views.toString();
  const totalSubmissions =
    total_submissions === 0 ? "--" : total_submissions.toString();

  const averageCompletionRate =
    avg_completion_rate !== null
      ? `${formatDecimal(avg_completion_rate)}%`
      : "--";

  const averageCompletionTime =
    avg_completion_time !== null
      ? `${formatTime(avg_completion_time, 2)}`
      : "--";

  return (
    <div className="rounded w-full h-full flex-1 flex flex-col gap-2">
      <div className="gap-6 grid sm:grid-cols-2">
        <div className="grid grid-cols-2 sm:grid-rows-4 gap-6">
          <CardTemplate
            name="Total Views"
            value={totalViews}
            icon={<EyeIcon className="w-5 h-5 text-blue-500" />}
            badge="All time"
          />
          <CardTemplate
            name="Total Submissions"
            value={totalSubmissions}
            icon={<SendIcon className="w-5 h-5 text-green-500" />}
            badge="All time"
          />
          <CardTemplate
            name="Completion Rate"
            value={averageCompletionRate}
            icon={<CheckCircleIcon className="w-5 h-5 text-yellow-500" />}
            badge="All time"
          />
          <CardTemplate
            name="Avg. Completion Time"
            value={averageCompletionTime}
            icon={<TimerIcon className="w-5 h-5 text-red-500" />}
            badge="All time"
          />
        </div>
        <SubmissionsActivityChart />
      </div>
    </div>
  );
};

const CardTemplate = ({
  name,
  value,
  icon,
  badge,
}: {
  name: string;
  value: string;
  icon: React.ReactNode;
  badge: string;
}) => {
  return (
    <Card className="px-4 py-3 flex flex-col flex-1 justify-between gap-2 items-start">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm">{name}</span>
        </div>
      </div>
      <span className="text-base font-semibold">{value}</span>
    </Card>
  );
};

export default FormOverview;
