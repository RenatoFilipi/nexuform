import { Card } from "@/components/ui/card";
import { ConstructionIcon } from "lucide-react";

const WipUI = ({ context }: { context: string }) => {
  return (
    <Card className="flex w-full justify-center items-center flex-col gap-4 py-36 px-4">
      <div className="flex justify-center items-center p-3 w-fit rounded bg-foreground/5">
        <ConstructionIcon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center gap-1 text-center">
        <span className="text-xl font-bold text-foreground">Working in Progress</span>
        <span className="text-muted-foreground max-w-md text-sm/relaxed">{context}</span>
      </div>
    </Card>
  );
};

export default WipUI;
