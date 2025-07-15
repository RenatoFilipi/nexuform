import { TPlan } from "@/utils/pricing";
import { ZapIcon } from "lucide-react";
import { ComponentProps } from "react";

type PlanBadgeProps = {
  type: TPlan;
  size?: "sm" | "md" | "lg" | "xl" | number;
} & ComponentProps<typeof ZapIcon>;

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

const PlanBadge = ({ type, size = "md", className = "", ...props }: PlanBadgeProps) => {
  const getPlanColor = () => {
    switch (type) {
      case "free_trial":
        return "text-blue-500 fill-blue-500";
      case "pro":
        return "text-yellow-500 fill-yellow-500";
      case "starter":
        return "text-pink-500 fill-pink-500";
      default:
        return "text-foreground fill-foreground";
    }
  };

  const iconSize = typeof size === "number" ? size : sizeMap[size];

  return <ZapIcon className={`${getPlanColor()} ${className}`} width={iconSize} height={iconSize} {...props} />;
};

export default PlanBadge;
