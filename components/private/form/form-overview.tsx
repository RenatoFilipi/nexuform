import { Card } from "@/components/ui/card";
import { CheckCircleIcon, EyeIcon, SendIcon, TimerIcon } from "lucide-react";

const FormOverview = () => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <div className="gap-6 grid sm:grid-cols-4 grid-cols-2">
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Views</span>
          </div>
          <span className="text-sm">--</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <SendIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm">Submissions</span>
          </div>
          <span className="text-sm">--</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Completion Rate</span>
          </div>
          <span className="text-sm">--</span>
        </Card>
        <Card className="px-4 py-3 flex flex-col flex-1 sm:h-24 justify-between gap-2">
          <div className="flex items-center gap-2">
            <TimerIcon className="w-5 h-5 text-red-500" />
            <span className="text-sm">Completion Time</span>
          </div>
          <span className="text-sm">--</span>
        </Card>
      </div>
      <div className="flex justify-center items-center flex-1 border rounded">
        Chart
      </div>
    </div>
  );
};

export default FormOverview;
