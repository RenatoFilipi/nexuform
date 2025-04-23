"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useUserStore from "@/stores/user";
import { useTranslations } from "next-intl";
import ManageSubscription from "../shared/subscription/manage-subscription";

const BillingUsage = () => {
  const t = useTranslations("app");
  const user = useUserStore();

  const startDate = new Date(user.subscription.start_date).toLocaleDateString();
  const dueDate = new Date(user.subscription.due_date).toLocaleDateString();

  const formsLimit = user.formsCount >= user.subscription.forms;
  const submissionsLimit = user.submissionsCount >= user.subscription.submissions;

  const formsUsage = (100 * user.formsCount) / user.subscription.forms;
  const submissionsUsage = (100 * user.submissionsCount) / user.subscription.submissions;

  console.log(user.formsCount);
  console.log(user.subscription.forms);

  const planName = (plan: string) =>
    ({
      free_trial: "Free Trial",
      basic: "Basic",
      pro: "Pro",
    }[plan] || "Custom");

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div className="flex justify-between w-full items-center gap-4 sm:justify-start">
          <h1 className="text-sm font-bold">{planName(user.subscription.plan)}</h1>
          <Badge variant={"gray"} className="flex justify-center items-center gap-2 text-xs">
            <span>{startDate}</span>-<span>{dueDate}</span>
          </Badge>
        </div>
        <ManageSubscription>
          <Button variant="outline" size="sm" className="w-full sm:w-auto self-end">
            {t("label_manage_sub")}
          </Button>
        </ManageSubscription>
      </div>
      <div className="flex justify-between items-center gap-6 flex-col sm:flex-row">
        <UsageCard
          limit={formsLimit}
          count={user.formsCount}
          usage={formsUsage}
          available={user.subscription.forms}
          label={t("label_forms")}
          labelUsage={t("label_all_time")}
          labelAvailable={t("label_forms_included")}
        />
        <UsageCard
          limit={submissionsLimit}
          count={user.submissionsCount}
          usage={submissionsUsage}
          available={user.subscription.submissions}
          label={t("label_submissions")}
          labelUsage={t("label_monthly_usage")}
          labelAvailable={t("label_submissions_included")}
        />
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
}: {
  limit: boolean;
  label: string;
  count: number;
  usage: number;
  available: number;
  labelAvailable: string;
  labelUsage: string;
}) => {
  const t = useTranslations("app");

  return (
    <Card className="flex flex-col gap-2 w-full p-4">
      <div className="flex justify-start items-center gap-4">
        <h2 className="font-semibold">{label}</h2>
        {limit && <Badge variant={"warning"}>{t("label_limit_reached")}</Badge>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-foreground/80">{labelUsage}</span>
          <span className="text-xs text-foreground/80">{count}</span>
        </div>
        <Progress value={usage} />
      </div>
      <p className="text-sm font-semibold">
        {available} {labelAvailable}
      </p>
    </Card>
  );
};

export default BillingUsage;
