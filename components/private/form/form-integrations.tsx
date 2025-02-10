import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { ConstructionIcon, UnplugIcon } from "lucide-react";
import UpgradePlans from "../core/upgrade-plans";

const FormIntegrations = () => {
  const { subscription } = useUserStore();

  if (subscription.plan === "free_trial" || subscription.plan === "")
    return (
      <div className="flex flex-col justify-center items-center gap-4 py-24 w-full">
        <div className="flex justify-center items-center p-2 rounded bg-primary/10">
          <UnplugIcon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm text-foreground/80">
          Upgrade your subscription to access integrations.
        </span>
        <UpgradePlans>
          <Button variant={"default"} size={"sm"}>
            Upgrade Subscription
          </Button>
        </UpgradePlans>
      </div>
    );

  return (
    <div className="flex justify-center items-center w-full flex-1 py-28">
      <div className="flex flex-col justify-center items-center gap-3">
        <ConstructionIcon />
        <span className="text-sm text-foreground/80">Under Development</span>
      </div>
    </div>
  );
};

export default FormIntegrations;
