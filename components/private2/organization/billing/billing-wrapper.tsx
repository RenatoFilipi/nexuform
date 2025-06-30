"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubmissionLog, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { getDaysDifference } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, LayersIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  submissionLogs: ESubmissionLog[];
  forms: EForm[];
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
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_billing")}</h1>
      </div>
      <div className="flex flex-col gap-10">
        <BillingUsage />
      </div>
    </div>
  );
};

const BillingUsage = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const startDate = new Date(app.subscription.start_date).toLocaleDateString();
  const dueDate = new Date(app.subscription.due_date).toLocaleDateString();
  const isFormLimit = app.subscription.forms <= app.forms.length;
  const isSubmissionsLimit = app.subscription.submissions <= app.submissionLogs.length;
  const formsUsage = Math.min(100, (100 * app.forms.length) / app.subscription.submissions);
  const submissionsUsage = Math.min(100, (100 * app.submissionLogs.length) / app.subscription.submissions);
  const remainingDays = getDaysDifference(new Date(), new Date(app.subscription.due_date));
  const isFreeTrial = app.subscription.plan === "free_trial";
  const isCanceled = app.subscription.status === "canceled";

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
        showBillingWarning={false}
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
    <Card className="relative w-full p-6 transition-all hover:shadow-md rounded border bg-gradient-to-br from-background to-muted/50 overflow-hidden">
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
              <AlertTriangleIcon className="h-3.5 w-3.5" />
              <span>{t("label_limit_reached")}</span>
            </Badge>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-foreground/70">{labelUsage}</span>
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

export default BillingWrapper;
