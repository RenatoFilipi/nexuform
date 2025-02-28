"use client";

import { Card } from "@/components/ui/card";
import useFormStore from "@/stores/form";
import { formatDecimal, formatTime } from "@/utils/functions";
import { EyeIcon, SendIcon, TimerIcon, VoteIcon } from "lucide-react";
import FormSubmissionsActivityChart from "./form-submissions-activity-chart";

const FormOverview = () => {
  const { formAnalytics } = useFormStore();
  const { total_submissions, total_views, avg_completion_rate, avg_completion_time } = formAnalytics;
  const totalViews = total_views === 0 ? "--" : total_views.toString();
  const totalSubmissions = total_submissions === 0 ? "--" : total_submissions.toString();
  const averageCompletionRate = avg_completion_rate !== null ? `${formatDecimal(avg_completion_rate)}%` : "--";
  const averageCompletionTime = avg_completion_time !== null ? `${formatTime(avg_completion_time, 1)}` : "--";

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-2">
      <div className="gap-6 grid sm:grid-cols-2">
        <div className="grid grid-cols-1 sm:grid-rows-4 sm:grid-cols-2 gap-2 sm:gap-6">
          <CardTemplate name="Total Views" value={totalViews} icon={<EyeIcon className="w-5 h-5 text-primary" />} />
          <CardTemplate
            name="Total Submissions"
            value={totalSubmissions}
            icon={<SendIcon className="w-5 h-5 text-primary" />}
          />
          <CardTemplate
            name="Completion Rate"
            value={averageCompletionRate}
            icon={<VoteIcon className="w-5 h-5 text-primary" />}
          />
          <CardTemplate
            name="Avg. Completion Time"
            value={averageCompletionTime}
            icon={<TimerIcon className="w-5 h-5 text-primary" />}
          />
        </div>
        <FormSubmissionsActivityChart />
      </div>
    </div>
  );
};

const CardTemplate = ({ name, value, icon }: { name: string; value: string; icon: React.ReactNode }) => {
  return (
    <Card className="px-4 py-3 flex sm:flex-col flex-1 justify-between gap-4 items-start">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="flex justify-center items-center">{icon}</div>
          <span className="text-xs sm:text-sm text-foreground/80">{name}</span>
        </div>
      </div>
      <span className="text-base font-medium">{value}</span>
    </Card>
  );
};

export default FormOverview;
