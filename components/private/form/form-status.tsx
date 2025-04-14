import { TFormStatus } from "@/utils/types";
import { BookDashedIcon, GlobeIcon, MonitorOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface IProps {
  status: TFormStatus;
  onStatusChange: (status: string) => void;
}

const FormStatus = ({ status, onStatusChange }: IProps) => {
  const t = useTranslations("app");
  const statusList = [
    {
      status: "draft",
      label: t("label_draft"),
      description: t("desc_draft"),
      icon: BookDashedIcon,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    },
    {
      status: "published",
      label: t("label_published"),
      description: t("desc_published"),
      icon: GlobeIcon,
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    },
    {
      status: "inactive",
      label: t("label_inactive"),
      description: t("desc_inactive"),
      icon: MonitorOffIcon,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
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
              className={`p-2 rounded-full ${statusItem.color} ${
                status === statusItem.status ? "opacity-100" : "opacity-70"
              }`}>
              <statusItem.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <span className="font-semibold text-sm">{statusItem.label}</span>
            <span className="text-xs text-foreground/70 text-start">{statusItem.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FormStatus;
