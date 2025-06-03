import { Badge } from "@/components/ui/badge";
import { TPlan } from "@/utils/types";

const PlanBadge = ({ plan }: { plan: TPlan }) => {
  const planLabels: Record<TPlan, string> = {
    free_trial: "Free Trial",
    basic: "Basic",
    pro: "Pro",
    business: "Business",
    custom: "Custom",
  };

  return <Badge variant="primary">{planLabels[plan] || "Custom"}</Badge>;
};

export default PlanBadge;
