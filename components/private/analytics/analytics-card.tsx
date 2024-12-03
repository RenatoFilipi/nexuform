import { Card } from "@/components/ui/card";
import { AnalyticsProps } from "@/helpers/modules";

const AnalyticsCard = ({ icon, label, value }: AnalyticsProps) => {
  return (
    <Card className="p-4 h-20">
      <div className="flex justify-between items-center h-full">
        <div className="bg-primary/15 p-3 rounded">{icon}</div>
        <div className="flex justify-between items-end flex-col h-full">
          <span className="text-sm text-foreground/80">{label}</span>
          <span className="font-semibold text-2xl">{value}</span>
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsCard;
