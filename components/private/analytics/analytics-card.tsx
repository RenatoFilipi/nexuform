import { Card } from "@/components/ui/card";
import { AnalyticsProps } from "@/utils/modules";

const AnalyticsCard = ({ icon, label, value }: AnalyticsProps) => {
  return (
    <Card className="p-3 w-full h-32 flex flex-col justify-between">
      <div className="">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-foreground/80">{label}</span>
        <span className="font-medium text-xl">{value}</span>
      </div>
    </Card>
  );
};

export default AnalyticsCard;
