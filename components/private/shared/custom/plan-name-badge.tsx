import { Badge } from "@/components/ui/badge";
import { TPlan } from "@/utils/pricing";
import { useTranslations } from "next-intl";
import { ComponentProps } from "react";

type PlanBadgeProps = {
  type: TPlan;
} & ComponentProps<typeof Badge>;

const PlanNameBadge = ({ type, className = "" }: PlanBadgeProps) => {
  const t = useTranslations("app");

  switch (type) {
    case "free_trial":
      return (
        <Badge variant={"default"} className={`${className}`}>
          {t("label_plan_free_trial")}
        </Badge>
      );
    case "starter":
      return (
        <Badge variant={"default"} className={`${className}`}>
          {t("label_plan_starter")}
        </Badge>
      );
    case "pro":
      return (
        <Badge variant={"default"} className={`${className}`}>
          {t("label_plan_pro")}
        </Badge>
      );
    default:
      return <Badge className={`${className}`}>Custom</Badge>;
  }
};

export default PlanNameBadge;
