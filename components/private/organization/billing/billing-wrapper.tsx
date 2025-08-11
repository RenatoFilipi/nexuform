"use client";

import { getBillingPortalAction } from "@/app/actions/stripe-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubmissionLog, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { getDaysDifference } from "@/utils/functions";
import { IContext } from "@/utils/interfaces";
import { TPlan } from "@/utils/pricing";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CalendarIcon,
  CalendarX2Icon,
  CircleHelpIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  LayersIcon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import PlanBadge from "../../shared/custom/plan-badge";
import RestrictedAccessUI from "../../shared/pages/restricted-access-ui";
import CancelSubscription from "../../shared/subscription/cancel-subscription";
import ManageSubscription from "../../shared/subscription/manage-subscription";

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

  if ((!app.context.isOrgOwner && app.subscription.plan !== "pro") || !app.context.isAdminOrHigher) {
    return <RestrictedAccessUI />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_billing")}</h1>
      </div>
      <div className="flex flex-col gap-6">
        <BillingPlan />
        <BillingUsage />
      </div>
    </div>
  );
};
const BillingUsage = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const isFormLimit = app.subscription.forms <= app.forms.length;
  const isSubmissionsLimit = app.subscription.submissions <= app.submissionLogs.length;
  const formsUsage = Math.min(100, (100 * app.forms.length) / app.subscription.forms);
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
        BillingWarningText=""
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
        BillingWarningText={t("label_billing_warning")}
        icon={<SendIcon className="h-5 w-5 text-primary" />}
      />
    </div>
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
  const hasBilling = app.subscription.status !== "canceled" && app.subscription.plan !== "free_trial";
  const isOwner = app.context.isOrgOwner;
  const isIncomplete = app.subscription.status === "incomplete";

  const planName = (plan: TPlan) =>
    ({
      free_trial: t("label_plan_free_trial"),
      starter: t("label_plan_starter"),
      pro: t("label_plan_pro"),
    }[plan] || "Custom");

  const onBillingPortalSession = async () => {
    try {
      const url = await getBillingPortalAction();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to redirect to billing portal:", error);
      toast.error(t("err_generic"));
    }
  };
  if (isIncomplete) {
    return (
      <Card className="p-5 w-full">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-2 rounded bg-foreground/5">
              <CreditCardIcon className="h-5 w-5 text-warning" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{t("label_pending_payment")}</h3>
              <p className="text-sm text-muted-foreground">{t("desc_pending_payment")}</p>
            </div>
          </div>
          <div className="ml-auto w-full md:w-auto flex justify-center items-center gap-3">
            <Button onClick={onBillingPortalSession} variant="secondary" size="sm" className="gap-2 px-4">
              <ExternalLinkIcon className="w-4 h-4" />
              {t("label_update_payment")}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isCanceled) {
    return (
      <Card className="p-5 w-full">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-2 rounded bg-foreground/5">
              <AlertTriangleIcon className="h-5 w-5 text-warning" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{t("label_sub_cancelled")}</h3>
              <p className="text-sm text-muted-foreground">{t("desc_sub_cancelled")}</p>
            </div>
          </div>
          <div className="ml-auto w-full md:w-auto flex justify-center items-center gap-3">
            <Button onClick={onBillingPortalSession} variant="outline" size="sm" className="gap-2 px-4">
              <ExternalLinkIcon className="w-4 h-4" />
              {t("label_update_payment")}
            </Button>
            <ManageSubscription>
              <Button className="gap-2 w-full" variant="secondary" size="sm">
                {t("label_manage_sub")}
              </Button>
            </ManageSubscription>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <PlanBadge
              type={app.subscription.plan as TPlan}
              size="xl"
              className="transition-transform hover:scale-105"
            />
            <div>
              <h2 className="text-2xl font-bold">{planName(app.subscription.plan as TPlan)}</h2>
              <p className="text-sm text-muted-foreground">{t("label_plan")}</p>
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
              {isOwner && hasBilling && (
                <>
                  <CancelSubscription>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                      {t("label_cancel_sub")}
                    </Button>
                  </CancelSubscription>
                  <Button onClick={onBillingPortalSession} variant="outline" size="sm" className="gap-2 px-4">
                    <ExternalLinkIcon className="w-4 h-4" />
                    {t("label_update_payment")}
                  </Button>
                </>
              )}
              <ManageSubscription>
                <Button variant="secondary" size="sm" className="gap-2 w-full sm:w-auto px-4">
                  {t("label_manage_sub")}
                </Button>
              </ManageSubscription>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-muted-foreground/40 dark:via-muted-foreground/40 to-transparent" />

        {/* Details Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {!isFreeTrial && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarIcon className="h-4 w-4 opacity-80" />
                {t("label_billing_cycle")}
              </div>
              <p className="text-sm font-medium">
                <span className="">{startDate}</span> - <span className="">{dueDate}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {isFreeTrial ? (
                <>
                  <CalendarX2Icon className="h-4 w-4 opacity-80" />
                  {t("label_free_trial_ends")}
                </>
              ) : (
                <>
                  <RefreshCwIcon className="h-4 w-4 opacity-80" />
                  {t("label_renews")}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{dueDate}</p>
              <span className="text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">{t("label_n_days_remaining", { n: remainingDays })}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
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
  BillingWarningText,
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
  BillingWarningText: string;
}) => {
  const t = useTranslations("app");
  const rawValue = 100 - Math.min(usage);
  const usagePercentage = rawValue % 1 === 0 ? rawValue.toString() : rawValue.toFixed(1);
  const usageValue = Math.min(usage, 100);

  return (
    <Card className="relative w-full p-6 transition-all hover:shadow-sm rounded border overflow-hidden group bg-gradient-to-br from-background to-muted/10 hover:border-primary/50">
      {/* Warning overlay for limit reached */}
      {limit && (
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-destructive/10 to-transparent pointer-events-none" />
      )}

      <div className="flex flex-col gap-6">
        {/* Header section */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors shadow-sm">
              {icon}
            </div>
            <div className="flex flex-col w-fit">
              <h2 className="font-semibold text-lg tracking-tight w-fit">{label}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {available.toLocaleString()} {labelAvailable}
              </p>
            </div>
          </div>

          {limit && (
            <Badge variant="destructive" className="w-fit px-3 py-1.5 rounded-lg">
              <AlertTriangleIcon className="w-4 h-4 mr-1.5" />
              <span className="truncate">{t("label_limit_reached")}</span>
            </Badge>
          )}
        </div>

        {/* Usage section */}
        <div className="space-y-4">
          {/* Usage label and count */}
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <span className="text-sm text-muted-foreground">{labelUsage}</span>
              {/* Billing warning message */}
              {showBillingWarning && (
                <WarningTooltip message={BillingWarningText}>
                  <CircleHelpIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </WarningTooltip>
              )}
            </div>
            <span className="text-sm font-medium">
              <span className={limit ? "text-destructive font-semibold" : "text-foreground"}>
                {count.toLocaleString()}
              </span>
              <span className="text-muted-foreground"> / {available.toLocaleString()}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2.5">
            <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`absolute h-full rounded-full ${limit ? "bg-destructive" : "bg-foreground"}`}
                style={{ width: `${usageValue}%` }}
              />
            </div>
            <div className="flex justify-end items-center text-xs">
              <span className="text-muted-foreground">
                {usagePercentage}% {t("label_available")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
const WarningTooltip = ({ children, message }: { children: React.ReactNode; message: string }) => {
  const t = useTranslations("app");
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="flex justify-center items-center gap-2 p-3">
          <AlertCircleIcon className="w-4 h-4" />
          <p className="text-xs">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BillingWrapper;
