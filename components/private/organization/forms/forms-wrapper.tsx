"use client";

import FormStatusBadge from "@/components/private/shared/custom/form-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { IContext } from "@/utils/interfaces";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
  BarChartIcon,
  ExternalLinkIcon,
  LayersIcon,
  MoreHorizontalIcon,
  PenIcon,
  PlusIcon,
  SendIcon,
  Settings2Icon,
  Share2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  forms: EForm[];
  context: IContext;
}

const FormsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const newFormPath = `/dashboard/organizations/${orgId}/forms/new`;

  const query = useQuery({
    queryKey: ["forms-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForms(props.forms);
      app.setContext(props.context);
      console.log(props.context);
      return null;
    },
  });

  const hasForms = app.forms.length > 0;
  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_forms")}</h1>
        <Button size="sm" variant="secondary" asChild>
          <Link href={newFormPath}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_create_form")}
          </Link>
        </Button>
      </div>
      {hasForms && (
        <div className="overflow-y-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {app.forms.map((f) => {
            return <FormCard key={f.id} form={f} />;
          })}
        </div>
      )}
      {!hasForms && (
        <Card className="flex w-full justify-center items-center flex-col gap-4 py-28 px-4">
          <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
            <LayersIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col justify-center items-center gap-1 text-center">
            <h3 className="text-xl font-bold text-foreground">{t("label_no_forms")}</h3>
            <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("desc_no_forms")}</p>
          </div>
        </Card>
      )}
    </div>
  );
};
const FormCard = ({ form }: { form: EForm }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const isPublished = form.status === "published";
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = isProduction ? "https" : "http";
  const fullUrl = `${protocol}://${window.location.host}/s/${form.public_id}`;

  const options = [
    {
      name: t("nav_overview"),
      icon: BarChartIcon,
      url: `/dashboard/organizations/${orgId}/form/${form.public_id}/overview`,
      enabled: true,
    },
    {
      name: t("nav_submissions"),
      icon: SendIcon,
      url: `/dashboard/organizations/${orgId}/form/${form.public_id}/submissions`,
      enabled: true,
    },
    {
      name: t("label_share"),
      icon: Share2Icon,
      url: `/dashboard/organizations/${orgId}/form/${form.public_id}/share`,
      enabled: true,
    },
    {
      name: t("label_settings"),
      icon: Settings2Icon,
      url: `/dashboard/organizations/${orgId}/form/${form.public_id}/settings`,
      enabled: true,
    },
    {
      name: t("label_editor"),
      icon: PenIcon,
      url: `/dashboard/organizations/${orgId}/form/${form.public_id}/editor`,
      enabled: true,
    },
  ];

  return (
    <Card className="flex flex-col h-40 p-5 justify-between border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm overflow-x-auto">
      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold truncate max-w-[270px] transition-colors">{form.name}</h1>
          <FormStatusBadge status={form.status as TFormStatus} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"xs"} className="">
              <MoreHorizontalIcon className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 p-2 flex flex-col gap-1" align="end">
            {options
              .filter((x) => x.enabled)
              .map((opt) => {
                return (
                  <a
                    href={opt.url}
                    key={opt.name}
                    className="cursor-pointer hover:bg-accent flex justify-between items-center text-sm p-1"
                    onClick={() => router.push(opt.url)}
                    onSelect={(e) => e.preventDefault()}>
                    <div className="flex justify-start items-center gap-2">
                      <opt.icon className="w-4 h-4" />
                      {opt.name}
                    </div>
                  </a>
                );
              })}
            {isPublished && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem key="goto" asChild>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:bg-accent flex justify-between items-center text-sm">
                    {t("label_go_to_form")}
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">
          {t("label_last_updated")} {formatDateRelativeToNow(form.updated_at, user.locale)}
        </span>
      </div>
    </Card>
  );
};
export default FormsWrapper;
