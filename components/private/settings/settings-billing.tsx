import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useUserStore from "@/stores/user";
import { getCurrentPlan, getDaysDifference } from "@/utils/functions";
import { TPlan } from "@/utils/types";
import { CalendarIcon, LeafIcon } from "lucide-react";
import ChangePlans from "../core/change-plans";

const SettingsBilling = () => {
  const userStore = useUserStore();
  const nextBillingDate = userStore.subscription.next_billing_date;
  const currentPlan = getCurrentPlan(userStore.subscription.plan as TPlan);
  const pendingDays = getDaysDifference(
    new Date(),
    new Date(userStore.subscription.next_billing_date)
  );
  const pendingDaysStr =
    pendingDays === 1 ? `1 day remaining` : `${pendingDays} days remaining`;

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
              Your current plan across this billing cycle.
            </p>
          </div>
          <div className="flex justify-between items-center flex-col sm:flex-row">
            <div className="flex justify-start items-center gap-8">
              <div className="flex w-fit p-4 gap-3 justify-center items-center">
                <LeafIcon className="w-7 h-7 text-primary" />
                <div className="flex flex-col justify-start">
                  <span className="text-lg font-semibold">
                    {planName(userStore.subscription.plan)}
                  </span>
                  <span className="text-xs text-foreground/80">Plan</span>
                </div>
              </div>
              <div className="flex w-fit p-4 gap-3 justify-center items-center">
                <CalendarIcon className="w-7 h-7 text-primary" />
                <div className="flex flex-col justify-start">
                  <span className="text-lg font-semibold">
                    {new Date(nextBillingDate).toLocaleDateString()}
                  </span>
                  <div className="flex justify-start">
                    <span className="text-xs text-foreground/80">
                      {pendingDaysStr}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <ChangePlans>
              <Button
                variant={"secondary"}
                size={"sm"}
                className="w-full sm:w-fit">
                Change Subscription Plan
              </Button>
            </ChangePlans>
          </div>
        </Card>
        <Card className="p-4 flex flex-col gap-4">
          <div>
            <h1 className="text-base font-semibold">Usage</h1>
            <p className="text-xs text-foreground/80">
              Your current usage across this billing cycle.
            </p>
          </div>
          <div className="flex w-full gap-4">
            <Card className="flex flex-col p-4 gap-2 w-full">
              <h2 className="text-foreground/80 text-sm">Forms</h2>
              <div className="flex justify-start items-center gap-3">
                <span className="font-semibold">
                  {userStore.formsCount} / {currentPlan?.forms}
                </span>
                {userStore.formsCount >= currentPlan.forms && (
                  <Badge variant={"warning"}>Limit Reached</Badge>
                )}
              </div>
              <p className="text-foreground/80 text-xs">
                {currentPlan?.forms} forms included.
              </p>
            </Card>
            <Card className="flex flex-col p-4 gap-2 w-full">
              <h2 className="text-foreground/80 text-sm">Submissions</h2>
              <div className="flex justify-start items-center gap-3">
                <span className="font-semibold">
                  {userStore.submissionsCount} / {currentPlan?.submissions}
                </span>
                {userStore.submissionsCount >= currentPlan.submissions && (
                  <Badge variant={"warning"}>Limit Reached</Badge>
                )}
              </div>
              <p className="text-foreground/80 text-xs">
                {currentPlan?.submissions} submissions included.
              </p>
            </Card>
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
