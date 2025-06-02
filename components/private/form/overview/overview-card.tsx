import { Card } from "@/components/ui/card";

const OverviewCard = ({ name, icon, content }: { name: string; icon: React.ReactNode; content: React.ReactNode }) => {
  return (
    <Card className="p-4 justify-between flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center w-full">
        <span className="text-xs">{name}</span>
        <div className="flex justify-center items-center p-2 bg-primary/10 rounded">{icon}</div>
      </div>
      {content}
    </Card>
  );
};

export default OverviewCard;
