import { Card } from "@/components/ui/card";

interface Props {
  icon: JSX.Element;
  title: string;
  value: string;
}

const AnalyticsCard = ({ icon, title, value }: Props) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div className="bg-foreground p-3 rounded">{icon}</div>
        <div className="flex flex-col justify-center items-end">
          <span className="text-sm text-foreground/80">{title}</span>
          <span className="font-semibold text-2xl">{value}</span>
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsCard;
