import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import ManageSubscription from "./manage-subscription";

const SubscriptionUI = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:px-6 lg:px-36 mt-36 w-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
          <WalletIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-6">
          <div className="text-center flex flex-col justify-center items-center gap-1">
            <h2 className="text-lg font-medium">Update your subscription.</h2>
            <p className="text-sm text-foreground/70">To keep using our plataform update your subscription.</p>
          </div>
          <div className="flex justify-center items-center w-fit">
            <ManageSubscription>
              <Button variant={"default"} size={"xs"}>
                Manage Subscription
              </Button>
            </ManageSubscription>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUI;
