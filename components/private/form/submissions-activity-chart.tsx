import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import { BirdIcon, ConstructionIcon } from "lucide-react";

const SubmissionsActivityChart = () => {
  const { overviewSubmissions } = useFormStore();
  const hasData = overviewSubmissions.length > 0;
  return (
    <div className="flex flex-col border py-3 px-4 rounded gap-3">
      <div className="flex flex-col justify-center items-center sm:items-start">
        <div className="flex justify-between items-center gap-4 w-full">
          <div className="flex justify-center items-center gap-3">
            <Button variant={"outline"} size={"xs"}>
              24 hours
            </Button>
            <Button variant={"outline"} size={"xs"}>
              7 days
            </Button>
            <Button variant={"outline"} size={"xs"}>
              30 days
            </Button>
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
        <div className="flex flex-col justify-center items-center gap-3 h-full">
          <ConstructionIcon />
          <span className="text-sm text-foreground/80">Under Development</span>
        </div>
      )}
    </div>
  );
};

export default SubmissionsActivityChart;
