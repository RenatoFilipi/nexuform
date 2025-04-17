import { ConstructionIcon } from "lucide-react";

const WipUI = ({ context }: { context: string }) => {
  return (
    <div className="flex justify-center items-center flex-col gap-2">
      <ConstructionIcon className="w-5 h-5 text-primary" />
      <span className="text-xs text-foreground/70">Working in Progress</span>
      <span className="font-semibold">{context}</span>
    </div>
  );
};

export default WipUI;
