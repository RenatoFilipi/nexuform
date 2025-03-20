import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useUserStore from "@/stores/user";
import { getCurrentPlan, getDaysDifference } from "@/utils/functions";
import { TPlan } from "@/utils/types";
import { BuildingIcon, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ManageSubscription from "../shared/manage-subscription";

const SettingsBilling = () => {
  const t = useTranslations("app");
  const userStore = useUserStore();
  const nextBillingDate = userStore.subscription.due_date;
  const currentPlan = getCurrentPlan(userStore.subscription.plan as TPlan);
  const pendingDays = getDaysDifference(new Date(), new Date(userStore.subscription.due_date));
  const pendingDaysStr = t("label_n_days_remaining", { n: pendingDays });
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
        <h1 className="font-semibold text-base">{t("label_billing_and_usage")}</h1>
        <p className="text-xs text-foreground/70">{t("desc_billing_and_usage")}</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-col gap-4 sm:flex-row">
            <div className="w-full">
              <h1 className="text-base font-semibold">{t("label_plan_summary")}</h1>
              <p className="text-xs text-foreground/70">{t("desc_plan_summary")}</p>
            </div>
            <div className="flex justify-center items-center gap-4 w-full sm:w-fit">
              <ManageSubscription>
                <Button variant="secondary" size="sm" className="w-full sm:w-auto self-end">
                  {t("label_manage_sub")}
                </Button>
              </ManageSubscription>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] dark:bg-foreground/5 rounded border">
              <BuildingIcon className="w-6 h-6 text-primary" />
              <div>
                <span className="text-lg font-semibold">{planName(userStore.subscription.plan)}</span>
                <p className="text-xs text-muted-foreground">{t("label_plan")}</p>
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
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold">{t("label_usage")}</h1>
            <p className="text-xs text-foreground/80">{t("desc_usage")}</p>
          </div>
          <div className="flex w-full gap-4 flex-col sm:flex-row">
            <Card className="flex flex-col justify-between p-4 gap-4 w-full">
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-foreground font-medium text-sm">{t("label_forms")}</h2>
                {userStore.formsCount >= currentPlan.forms && (
                  <Badge variant={"warning"}>{t("label_limit_reached")}</Badge>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-1 flex-col">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-foreground/80">{t("label_all_time")}</span>
                    <span className="text-xs text-foreground/80">{userStore.formsCount}</span>
                  </div>
                  <Progress value={formsUsage} />
                </div>
                <p className="text-foreground/80 text-xs">
                  {currentPlan?.forms} {t("label_forms_included")}
                </p>
              </div>
            </Card>
            <Card className="flex flex-col justify-between p-4 gap-4 w-full">
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-foreground font-medium text-sm first-letter:uppercase">{t("label_submissions")}</h2>
                {userStore.submissionsCount >= currentPlan.submissions && (
                  <Badge variant={"warning"}>{t("label_forms_included")}</Badge>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center gap-1 flex-col">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-foreground/80">{t("label_monthly_usage")}</span>
                    <span className="text-xs text-foreground/80">{userStore.submissionsCount}</span>
                  </div>
                  <Progress value={submissionsUsage} />
                </div>
                <p className="text-foreground/80 text-xs">
                  {currentPlan?.submissions} {t("label_submissions_included")}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBilling;
