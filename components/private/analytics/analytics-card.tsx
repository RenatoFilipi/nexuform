import GenericLoader from "@/components/core/generic-loader";
import { Card } from "@/components/ui/card";
import { AnalyticsCardProps } from "@/helpers/interfaces";

const AnalyticsCard = ({ icon, title, value, state }: AnalyticsCardProps) => {
  return (
    <Card className="p-4 h-20">
      <div className="flex justify-between items-center h-full">
        <div className="bg-primary/15 p-3 rounded">{icon}</div>
        <div className="flex justify-between items-end flex-col h-full">
          <span className="text-sm text-foreground/80">{title}</span>
          {state === "loading" && <GenericLoader className="w-6 h-6 mt-2" />}
          {state === "idle" && (
            <span className="font-semibold text-2xl">{value}</span>
          )}
          {state === "error" && (
            <span className="text-destructive text-sm">
              Something went wrong
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsCard;
