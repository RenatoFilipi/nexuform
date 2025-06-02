import FormStatusBadge from "@/components/shared/badges/form-status-badge";
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
import { BarChartIcon, MoreHorizontalIcon, PenIcon, SendIcon, Share2Icon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import FormDelete from "../shared/form/form-delete";

const DashboardFormCard = ({ form }: { form: EForm }) => {
  const t = useTranslations("app");
  const router = useRouter();
  const { id, name, status, updated_at } = form;
  const user = useUserStore();
  const options = [
    { name: t("nav_overview"), icon: BarChartIcon, url: `/dashboard/forms/${id}/overview` },
    { name: t("nav_submissions"), icon: SendIcon, url: `/dashboard/forms/${id}/submissions` },
    { name: t("label_share"), icon: Share2Icon, url: `/dashboard/forms/${id}/share` },
    { name: t("label_edit"), icon: PenIcon, url: `/dashboard/editor/${id}` },
  ];

  return (
    <Card className="flex flex-col h-48 p-5 justify-between border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm">
      <div className="flex w-full justify-between items-start">
        <div
          className="flex flex-col gap-2 cursor-pointer w-full"
          onClick={() => router.push(`/dashboard/forms/${id}/overview`)}>
          <span className="text-base font-medium truncate max-w-[270px] group-hover:text-primary transition-colors">
            {name}
          </span>
          <FormStatusBadge status={status as TFormStatus} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"xs"}
              className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
              <MoreHorizontalIcon className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            {options.map((opt) => {
              return (
                <DropdownMenuItem
                  key={opt.name}
                  className="cursor-pointer hover:bg-accent flex justify-between items-center"
                  onClick={() => router.push(opt.url)}
                  onSelect={(e) => e.preventDefault()}>
                  {opt.name}
                  <opt.icon className="w-4 h-4" />
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <FormDelete formId={id} formName={name}>
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:bg-destructive/5 focus:text-destructive flex justify-between items-center"
                onSelect={(e) => e.preventDefault()}>
                {t("label_delete")}
                <TrashIcon className="w-4 h-4" />
              </DropdownMenuItem>
            </FormDelete>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="text-xs text-muted-foreground">
          {t("label_last_updated")} {formatDateRelativeToNow(updated_at, user.locale)}
        </span>
      </div>
    </Card>
  );
};

export default DashboardFormCard;
