import { ConstructionIcon } from "lucide-react";

const SubmissionsActivityChart = () => {
  return (
    <div className="flex justify-center items-center text-sm border rounded">
      <div className="flex flex-col justify-center items-center gap-3">
        <ConstructionIcon />
        <span className="text-sm text-foreground/80">Under Development</span>
      </div>
    </div>
  );
};

export default SubmissionsActivityChart;
