import { BriefcaseIcon, RocketIcon, SettingsIcon, ZapIcon } from "lucide-react";

const PlanIcon = ({ type }: { type: string }) => {
  const icons = {
    free_trial: <ZapIcon className="w-5 h-5 text-purple-500" />,
    basic: <ZapIcon className="w-5 h-5 text-blue-500" />,
    pro: <RocketIcon className="w-5 h-5 text-emerald-500" />,
    business: <BriefcaseIcon className="w-5 h-5 text-amber-500" />,
    custom: <SettingsIcon className="w-5 h-5 text-cyan-500" />,
  };

  return icons[type as keyof typeof icons] || <ZapIcon className="w-5 h-5 text-primary" />;
};

export default PlanIcon;
