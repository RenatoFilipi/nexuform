import { Button } from "@/components/ui/button";
import { CrownIcon } from "lucide-react";
import ManageSubscription from "./manage-subscription";

const UpgradeToProUI = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:px-6 lg:px-36 mt-36 w-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-amber-500/10">
          <CrownIcon className="w-6 h-6 text-amber-500" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-6">
          <div className="text-center flex flex-col justify-center items-center gap-1">
            <h2 className="text-lg font-medium">Upgrade to Pro</h2>
            <p className="text-sm text-foreground/70">
              To access this feature, you must upgrade your subscription to pro plan.
            </p>
          </div>
          <div className="flex justify-center items-center w-fit">
            <ManageSubscription>
              <Button variant={"secondary"} size={"xs"}>
                Upgrade to Pro
              </Button>
            </ManageSubscription>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToProUI;
