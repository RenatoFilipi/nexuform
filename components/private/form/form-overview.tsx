import { Card } from "@/components/ui/card";
import useFormStore from "@/stores/form";
import { formatDecimal, formatTime } from "@/utils/functions";
import { CheckCircleIcon, EyeIcon, SendIcon, TimerIcon } from "lucide-react";

const FormOverview = () => {
  const { formAnalytics, submissions } = useFormStore();
  const {
    total_submissions,
    total_views,
    avg_completion_rate,
    avg_completion_time,
  } = formAnalytics;
  const submissionsCompletionTimes = submissions.map(
    (x) => x.completion_time ?? 0
  );

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
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="gap-6 grid sm:grid-cols-4 grid-cols-2">
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Views</span>
          </div>
          <span className="text-sm">{totalViews}</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <SendIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm">Submissions</span>
          </div>
          <span className="text-sm">{totalSubmissions}</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Completion Rate</span>
          </div>
          <span className="text-sm">{averageCompletionRate}</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-red-500" />
            <span className="text-sm">Avg Completion Time</span>
          </div>
          <span className="text-sm">{averageCompletionTime}</span>
        </Card>
      </div>
      <div className="flex justify-center items-center flex-1 border rounded">
        Chart
      </div>
    </div>
  );
};

export default FormOverview;
