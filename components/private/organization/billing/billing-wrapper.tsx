"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubmissionLog, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { getDaysDifference } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  CalendarX2Icon,
  CircleHelpIcon,
  LayersIcon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import PlanIcon from "../../shared/custom/plan-icon";
import CancelSubscription from "../../shared/subscription/cancel-subscription";
import ManageSubscription2 from "../../shared/subscription/manage-subscription2";
import { IContext } from "@/utils/interfaces";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  submissionLogs: ESubmissionLog[];
  forms: EForm[];
  context: IContext;
}

const BillingWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["org-billing-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setSubmissionLogs(props.submissionLogs);
      app.setForms(props.forms);
      app.setContext(props.context);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_billing")}</h1>
      </div>
      <div className="flex flex-col gap-6">
        <BillingUsage />
        <BillingPlan />
      </div>
    </div>
  );
};
const BillingUsage = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const isFormLimit = app.subscription.forms <= app.forms.length;
  const isSubmissionsLimit = app.subscription.submissions <= app.submissionLogs.length;
  const formsUsage = Math.min(100, (100 * app.forms.length) / app.subscription.submissions);
  const submissionsUsage = Math.min(100, (100 * app.submissionLogs.length) / app.subscription.submissions);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      <BillingUsageCard
        limit={isFormLimit}
        count={app.forms.length}
        usage={formsUsage}
        available={app.subscription.forms}
        label={t("label_forms")}
        labelUsage={t("label_all_time")}
        labelAvailable={t("label_forms_included")}
        showBillingWarning={false}
        icon={<LayersIcon className="h-5 w-5 text-primary" />}
      />
      <BillingUsageCard
        limit={isSubmissionsLimit}
        count={app.submissionLogs.length}
        usage={submissionsUsage}
        available={app.subscription.submissions}
        label={t("label_submissions")}
        labelUsage={t("label_monthly_usage")}
        labelAvailable={t("label_submissions_included")}
        showBillingWarning={true}
        icon={<SendIcon className="h-5 w-5 text-primary" />}
      />
    </div>
  );
};
const BillingUsageCard = ({
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
    <Card className="relative w-full p-6 transition-all hover:shadow-md rounded border overflow-hidden">
      {limit && (
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-transparent pointer-events-none" />
      )}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">{icon}</div>
            <div>
              <h2 className="font-semibold text-lg tracking-tight">{label}</h2>
              <p className="text-sm text-foreground/70">
                {available.toLocaleString()} {labelAvailable}
              </p>
            </div>
          </div>
          {limit && (
            <Badge variant={"destructive"} className="">
              <AlertTriangleIcon className="h-3.5 w-3.5" />
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
const BillingPlan = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const isCanceled = app.subscription.status === "canceled";
  const startDate = new Date(app.subscription.start_date).toLocaleDateString();
  const dueDate = new Date(app.subscription.due_date).toLocaleDateString();
  const isFreeTrial = app.subscription.plan === "free_trial";
  const remainingDays = getDaysDifference(new Date(), new Date(app.subscription.due_date));
  const showCancelButton = app.subscription.status !== "canceled" && app.subscription.plan !== "free_trial";

  const planName = (plan: string) =>
    ({
      free_trial: "Free Trial",
      basic: "Basic",
      pro: "Pro",
    }[plan] || "Custom");

  if (isCanceled) {
    return (
      <Card className="p-6 flex flex-col md:flex-row gap-8 w-full shadow-sm">
        <div className="md:w-2/3 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row gap-4 items-center text-center md:text-left">
            <AlertTriangleIcon className="h-6 w-6 flex-shrink-0 text-warning" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("label_sub_cancelled")}</h3>
              <p className="text-muted-foreground text-sm">{t("desc_sub_cancelled")}</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/3 flex flex-col justify-center items-center md:items-end">
          <ManageSubscription2>
            <Button className="gap-2 w-full md:w-auto" variant="secondary" size="sm">
              <ArrowUpRightIcon className="h-4 w-4" />
              {t("label_manage_sub")}
            </Button>
          </ManageSubscription2>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden rounded p-6 shadow-sm w-full">
      <div className="absolute right-0 top-0 h-full w-1 bg-primary hidden" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <PlanIcon type={user.subscription.plan} />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{planName(app.subscription.plan)}</h2>
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
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 items-center">
          {showCancelButton && (
            <CancelSubscription>
              <Button variant="ghost" size="xs" className="w-full sm:w-auto gap-2 text-muted-foreground">
                {t("label_cancel_sub")}
              </Button>
            </CancelSubscription>
          )}
          <ManageSubscription2>
            <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
              <ArrowUpRightIcon className="h-4 w-4" />
              {t("label_manage_sub")}
            </Button>
          </ManageSubscription2>
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

export default BillingWrapper;
