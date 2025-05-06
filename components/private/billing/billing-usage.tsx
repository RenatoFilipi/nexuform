"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useUserStore from "@/stores/user";
import { getDaysDifference } from "@/utils/functions";
import {
  AlertCircleIcon,
  AlertTriangle,
  CalendarIcon,
  CalendarX2Icon,
  CircleHelpIcon,
  LayersIcon,
  RefreshCwIcon,
  Send,
  Settings,
  ZapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import ManageSubscription from "../shared/subscription/manage-subscription";

const BillingUsage = () => {
  const t = useTranslations("app");
  const user = useUserStore();

  const startDate = new Date(user.subscription.start_date).toLocaleDateString();
  const dueDate = new Date(user.subscription.due_date).toLocaleDateString();

  const formsLimit = user.formsCount >= user.subscription.forms;
  const submissionsLimit = user.submissionLogs.length >= user.subscription.submissions;

  const formsUsage = Math.min(100, (100 * user.formsCount) / user.subscription.forms);
  const submissionsUsage = Math.min(100, (100 * user.submissionLogs.length) / user.subscription.submissions);

  const remainingDays = getDaysDifference(new Date(), new Date(user.subscription.due_date));

  const isFreeTrial = user.subscription.plan === "free_trial";

  const planName = (plan: string) =>
    ({
      free_trial: "Free Trial",
      basic: "Basic",
      pro: "Pro",
    }[plan] || "Custom");

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">{t("label_billing_and_usage")}</h1>
            <p className="text-sm text-muted-foreground">{t("desc_billing_and_usage")}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-6 flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <UsageCard
            limit={formsLimit}
            count={user.formsCount}
            usage={formsUsage}
            available={user.subscription.forms}
            label={t("label_forms")}
            labelUsage={t("label_all_time")}
            labelAvailable={t("label_forms_included")}
            showBillingWarning={false}
            icon={<LayersIcon className="h-5 w-5 text-primary" />}
          />
          <UsageCard
            limit={submissionsLimit}
            count={user.submissionLogs.length}
            usage={submissionsUsage}
            available={user.subscription.submissions}
            label={t("label_submissions")}
            labelUsage={t("label_monthly_usage")}
            labelAvailable={t("label_submissions_included")}
            showBillingWarning
            icon={<Send className="h-5 w-5 text-primary" />}
          />
        </div>
        <div className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm w-full">
          <div className="absolute right-0 top-0 h-full w-1 bg-primary" />
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ZapIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{planName(user.subscription.plan)}</h2>
                  <p className="text-sm text-foreground/70">{t("label_plan")}</p>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {!isFreeTrial && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                    <CalendarIcon className="h-4 w-4" />
                    {t("label_billing_cycle")}
                  </h3>
                  <p className="text-sm">
                    {startDate} - {dueDate}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {isFreeTrial && (
                  <h3 className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                    <CalendarX2Icon className="h-4 w-4" />
                    {t("label_free_trial_ends")}
                  </h3>
                )}
                {!isFreeTrial && (
                  <h3 className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                    <RefreshCwIcon className="h-4 w-4" />
                    {t("label_renews")}
                  </h3>
                )}
                <div className="flex justify-center items-center w-fit gap-2">
                  <p className="text-sm">{dueDate}</p>-
                  <p className="text-sm">{t("label_n_days_remaining", { n: remainingDays })}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <ManageSubscription>
                <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
                  <Settings className="h-4 w-4" />
                  {t("label_manage_sub")}
                </Button>
              </ManageSubscription>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const UsageCard = ({
  label,
  limit,
  available,
  count,
  usage,
  labelAvailable,
  labelUsage,
  icon,
  showBillingWarning,
}: {
  limit: boolean;
  label: string;
  count: number;
  usage: number;
  available: number;
  labelAvailable: string;
  labelUsage: string;
  icon?: React.ReactNode;
  showBillingWarning: boolean;
}) => {
  const t = useTranslations("app");
  const rawValue = 100 - Math.min(usage);
  const usagePercentage = rawValue % 1 === 0 ? rawValue.toString() : rawValue.toFixed(1);

  return (
    <Card className="relative w-full p-6 transition-all hover:shadow-md rounded-xl border bg-gradient-to-br from-background to-muted/50 overflow-hidden">
      {limit && (
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent pointer-events-none" />
      )}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">{icon}</div>
            <div>
              <h2 className="font-semibold text-lg tracking-tight">{label}</h2>
              <p className="text-xs text-foreground/70">
                {available.toLocaleString()} {labelAvailable}
              </p>
            </div>
          </div>
          {limit && (
            <Badge variant={"destructive"} className="animate-pulse gap-1.5 px-2.5 py-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{t("label_limit_reached")}</span>
            </Badge>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-foreground/70">{labelUsage}</span>
              {showBillingWarning && (
                <WarningTooltip>
                  <CircleHelpIcon className="w-4 h-4 text-foreground/70" />
                </WarningTooltip>
              )}
            </div>
            <span className="text-sm font-medium">
              <span className={limit ? "text-destructive" : ""}>{count.toLocaleString()}</span>
              {" / "}
              {available.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            <Progress value={usage} className="h-2.5" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/70">
                {usagePercentage}% {t("label_available")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const WarningTooltip = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="flex justify-center items-center gap-2">
          <AlertCircleIcon className="w-4 h-4 text-warning" />
          <p className="text-xs">{t("label_billing_warning")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BillingUsage;
