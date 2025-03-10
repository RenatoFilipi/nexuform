import FormStatusBadge from "@/components/shared/form-status-badge";
import { Card } from "@/components/ui/card";
import useUserStore from "@/stores/user";
import { EForm } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const DashboardFormCard = ({ form }: { form: EForm }) => {
  const t = useTranslations("app");
  const { id, name, status, updated_at } = form;
  const { locale } = useUserStore();

  return (
    <Link href={`/dashboard/forms/${id}`}>
      <Card className="flex h-44 p-4 hover:border-foreground/20 items-start flex-col justify-between shadow-none relative group hover:bg-foreground/5 transition-all">
        <div>
          <div className="flex justify-between items-start w-full flex-col gap-2">
            <span className="text-sm truncate max-w-[240px] font-medium">{name}</span>
            <span className="text-xs text-foreground/70">
              {t("label_last_updated")} {formatDateRelativeToNow(updated_at, locale)}
            </span>
            <FormStatusBadge status={status as TFormStatus} uppercase />
          </div>
          <ChevronRightIcon className="absolute right-4 top-4 text-foreground-lighter transition-all duration-200 group-hover:right-3 group-hover:text-foreground " />
        </div>
      </Card>
    </Link>
  );
};

export default DashboardFormCard;
