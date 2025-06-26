import { TFormStatus } from "@/utils/types";
import { DraftingCompassIcon, PauseCircleIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface IProps {
  status: TFormStatus;
  onStatusChange: (status: string) => void;
}

const SettingsFormStatus = ({ status, onStatusChange }: IProps) => {
  const t = useTranslations("app");
  const statusList = [
    {
      status: "draft",
      label: t("label_draft"),
      description: t("desc_draft"),
      icon: DraftingCompassIcon,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
    },
    {
      status: "published",
      label: t("label_published"),
      description: t("desc_published"),
      icon: RocketIcon,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    {
      status: "inactive",
      label: t("label_inactive"),
      description: t("desc_inactive"),
      icon: PauseCircleIcon,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300",
    },
  ];

  return (
    <div className="grid gap-3 overflow-y-auto sm:grid-cols-1 w-full">
      {statusList.map((statusItem, index) => (
        <button
          key={index}
          onClick={() => onStatusChange(statusItem.status)}
          className={`${
            statusItem.status === status ? "border-primary bg-primary/5" : "hover:bg-foreground/5"
          } border p-4 flex gap-4 h-full w-full rounded`}>
          <div className="flex items-center justify-center">
            <div
              className={`p-2 rounded ${statusItem.color} ${
                status === statusItem.status ? "opacity-100" : "opacity-60"
              }`}>
              <statusItem.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <span className="font-semibold text-sm">{statusItem.label}</span>
            <span className="text-xs text-muted-foreground text-start">{statusItem.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SettingsFormStatus;
