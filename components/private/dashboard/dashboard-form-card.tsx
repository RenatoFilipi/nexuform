import FormStatusBadge from "@/components/shared/form-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUserStore from "@/stores/user";
import { EForm } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormDelete from "../shared/form-delete";

const DashboardFormCard = ({ form }: { form: EForm }) => {
  const t = useTranslations("app");
  const router = useRouter();
  const { id, name, status, updated_at } = form;
  const user = useUserStore();

  return (
    <Card className="flex flex-col h-44 p-4 justify-between">
      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="text-sm truncate max-w-[240px] font-medium">{name}</span>
          <FormStatusBadge status={status as TFormStatus} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"xs"}>
              <MoreHorizontalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/forms/${id}`)}
              onSelect={(e) => e.preventDefault()}>
              {t("label_view")}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/editor/${id}`)}
              onSelect={(e) => e.preventDefault()}>
              {t("label_edit")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <FormDelete formId={id} formName={name}>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={(e) => e.preventDefault()}>
                {t("label_delete")}
              </DropdownMenuItem>
            </FormDelete>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-start items-center w-full">
        <span className="text-xs text-foreground/70">
          {t("label_last_updated")} {formatDateRelativeToNow(updated_at, user.locale)}
        </span>
      </div>
    </Card>
  );

  return (
    <Link href={`/dashboard/forms/${id}`}>
      <Card className="flex h-44 p-4 hover:border-foreground/20 items-start flex-col justify-between shadow-none relative group hover:bg-foreground/5 transition-all">
        <div>
          <div className="flex justify-between items-start w-full flex-col gap-2">
            <span className="text-sm truncate max-w-[240px] font-medium">{name}</span>
            <span className="text-xs text-foreground/70">
              {t("label_last_updated")} {formatDateRelativeToNow(updated_at, user.locale)}
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
