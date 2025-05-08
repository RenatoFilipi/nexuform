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
import { ArrowUpRightIcon, BarChartIcon, MoreHorizontalIcon, PenIcon, Share2Icon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import FormShare from "../form/form-share";
import FormDelete from "../shared/form/form-delete";

const DashboardFormCard = ({ form }: { form: EForm }) => {
  const t = useTranslations("app");
  const router = useRouter();
  const { id, name, status, updated_at } = form;
  const user = useUserStore();

  return (
    <Card className="flex flex-col h-48 p-5 justify-between border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm">
      <div className="flex w-full justify-between items-start">
        <div
          className="flex flex-col gap-2 cursor-pointer w-full"
          onClick={() => router.push(`/dashboard/forms/${id}`)}>
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
            <DropdownMenuItem
              className="cursor-pointer hover:bg-accent flex justify-between items-center"
              onClick={() => router.push(`/dashboard/forms/${id}`)}
              onSelect={(e) => e.preventDefault()}>
              {t("nav_overview")}
              <BarChartIcon className="w-4 h-4" />
            </DropdownMenuItem>
            <FormShare form={form}>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-accent flex justify-between items-center"
                onSelect={(e) => e.preventDefault()}>
                {t("label_share")}
                <Share2Icon className="w-4 h-4" />
              </DropdownMenuItem>
            </FormShare>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-accent flex justify-between items-center"
              onClick={() => router.push(`/dashboard/editor/${id}`)}
              onSelect={(e) => e.preventDefault()}>
              {t("label_edit")}
              <PenIcon className="w-4 h-4" />
            </DropdownMenuItem>
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
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => router.push(`/dashboard/editor/${id}`)}>
          <ArrowUpRightIcon className="w-4 h-4 mr-2" />
          {t("label_edit")}
        </Button>
      </div>
    </Card>
  );
};

export default DashboardFormCard;
