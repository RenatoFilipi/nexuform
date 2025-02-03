import { ConstructionIcon } from "lucide-react";

const Settings = async () => {
  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex justify-center items-center w-full h-full flex-1">
        <div className="flex flex-col justify-center items-center gap-3">
          <ConstructionIcon />
          <span className="text-sm text-foreground/80">Under Development</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
