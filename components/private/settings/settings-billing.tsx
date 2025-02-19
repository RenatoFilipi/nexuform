import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useUserStore from "@/stores/user";
import { getCurrentPlan, getDaysDifference } from "@/utils/functions";
import { TPlan } from "@/utils/types";
import { BuildingIcon, CalendarIcon } from "lucide-react";
import ManageSubscription from "../shared/manage-subscription";

const SettingsBilling = () => {
  const userStore = useUserStore();
  const nextBillingDate = userStore.subscription.due_date;
  const currentPlan = getCurrentPlan(userStore.subscription.plan as TPlan);
  const pendingDays = getDaysDifference(new Date(), new Date(userStore.subscription.due_date));
  const pendingDaysStr = pendingDays === 1 ? `1 day remaining` : `${pendingDays} days remaining`;
  const formsUsage = (100 * userStore.formsCount) / currentPlan.forms;
  const submissionsUsage = (100 * userStore.submissionsCount) / currentPlan.submissions;

  const planName = (plan: string) =>
    ({
      free_trial: "Free Trial",
      basic: "Basic",
      pro: "Pro",
    }[plan] || "Custom");

  return (
    <div className="flex flex-col w-full h-full gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">Billing & Usage</h1>
        <p className="text-xs text-foreground/70">
          View information about your billing and usage. Track your expenses, limits, and billing history.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <Card className="p-4 flex flex-col gap-4">
          <div>
            <h1 className="text-base font-semibold">Plan Summary</h1>
            <p className="text-xs text-foreground/70">Your current plan for this billing cycle.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] dark:bg-foreground/5 rounded border">
              <BuildingIcon className="w-6 h-6 text-primary" />
              <div>
                <span className="text-lg font-semibold">{planName(userStore.subscription.plan)}</span>
                <p className="text-xs text-muted-foreground">Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] dark:bg-foreground/5 rounded border">
              <CalendarIcon className="w-6 h-6 text-primary" />
              <div>
                <span className="text-lg font-semibold">{new Date(nextBillingDate).toLocaleDateString()}</span>
                <p className="text-xs text-muted-foreground">{pendingDaysStr}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <ManageSubscription>
              <Button variant="secondary" size="sm" className="w-full sm:w-auto self-end">
                Manage Subscription
              </Button>
            </ManageSubscription>
          </div>
        </Card>
        <Card className="p-4 flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold">Usage</h1>
            <p className="text-xs text-foreground/80">Your current usage across this billing cycle.</p>
          </div>
          <div className="flex w-full gap-4">
            <Card className="flex flex-col justify-between p-4 gap-4 w-full">
              <div className="flex justify-start items-center gap-2">
                <h2 className="text-foreground font-medium text-sm">Forms</h2>
                {userStore.formsCount >= currentPlan.forms && <Badge variant={"warning"}>Limit reached</Badge>}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-1 flex-col">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-foreground/80">All time</span>
                    <span className="text-xs text-foreground/80">{userStore.formsCount}</span>
                  </div>
                  <Progress value={formsUsage} />
                </div>
                <p className="text-foreground/80 text-xs">{currentPlan?.forms} forms included.</p>
              </div>
            </Card>
            <Card className="flex flex-col justify-between p-4 gap-4 w-full">
              <div className="flex justify-start items-center gap-2">
                <h2 className="text-foreground font-medium text-sm">Submissions</h2>
                {userStore.submissionsCount >= currentPlan.submissions && (
                  <Badge variant={"warning"}>Limit reached</Badge>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-1 flex-col">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-foreground/80">Monthly usage</span>
                    <span className="text-xs text-foreground/80">{userStore.submissionsCount}</span>
                  </div>
                  <Progress value={submissionsUsage} />
                </div>
                <p className="text-foreground/80 text-xs">{currentPlan?.submissions} submissions included.</p>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsBilling;
