import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useUserStore from "@/stores/user";
import { CalendarIcon, ZapIcon } from "lucide-react";
import UpgradePlans from "../core/upgrade-plans";

const SettingsBilling = () => {
  const userStore = useUserStore();
  const turnouverDate = userStore.subscription.start_date;
  console.log(turnouverDate);

  const planName = (plan: string) =>
    ({
      free_trial: "Free Trial",
      basic: "Basic",
      pro: "Pro",
    }[plan] || "Custom");

  return (
    <div className="flex flex-col w-full h-full flex-1 gap-8">
      <div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">Billing & Usage</h1>
          <p className="text-sm text-foreground/80">
            View information about your billing and usage. Track your expenses,
            limits, and billing history.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Card className="p-4 flex flex-col gap-4">
          <div>
            <h1 className="text-base font-semibold">Plan Summary</h1>
            <p className="text-xs text-foreground/80">
              Your current plana and usage across this billing cycle.
            </p>
          </div>
          <div className="flex justify-between items-center flex-col sm:flex-row">
            <div className="flex justify-start items-center gap-8">
              <div className="flex w-fit p-4 gap-2 justify-center items-center">
                <ZapIcon className="w-8 h-8 text-primary" />
                <div className="flex flex-col justify-start">
                  <span className="text-lg font-semibold">
                    {planName(userStore.subscription.plan)}
                  </span>
                  <span className="text-xs text-foreground/80">Plan</span>
                </div>
              </div>
              <div className="flex w-fit p-4 gap-2 justify-center items-center">
                <CalendarIcon className="w-8 h-8 text-primary" />
                <div className="flex flex-col justify-start">
                  <span className="text-lg font-semibold">
                    {new Date(turnouverDate).toLocaleDateString()}
                  </span>
                  <div className="flex justify-start">
                    <span className="text-xs text-foreground/80">
                      turnover Date
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <UpgradePlans>
              <Button
                variant={"secondary"}
                size={"sm"}
                className="w-full sm:w-fit">
                Upgrade Subscription Plan
              </Button>
            </UpgradePlans>
          </div>
        </Card>
        <Card className="p-4 flex flex-col gap-4 h-full">
          <div>
            <h1 className="text-base font-semibold">Payment History</h1>
            <p className="text-xs text-foreground/80">
              View your past transactions and invoices.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <span className="text-sm text-foreground/80 py-10">
              No payment history to show
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsBilling;
