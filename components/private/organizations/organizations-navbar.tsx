"use client";

import {
  BarChartIcon,
  ChartNoAxesColumnIcon,
  ChevronLeftIcon,
  LayersIcon,
  SendIcon,
  Settings2Icon,
  Share2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const OrganizationsNavbar = () => {
  const pathname = usePathname();
  const formId = pathname.split("/")[5];
  const isNewFormResource = pathname.split("/")[5] === "new";
  const isFormResource = pathname.split("/")[4] === "form";

  if (isNewFormResource && formId) return <NewFormNavbar />;
  if (isFormResource && formId) return <FormNavbar />;
  return <OrganizationNavbar />;
};
const NewFormNavbar = () => {
  const t = useTranslations("app");
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];

  return (
    <div className="border-b h-10 flex justify-start items-center gap-2 px-2 sm:px-6 overflow-x-auto fixed bg-background w-full truncate">
      <div>
        <Link
          href={`/dashboard/organizations/${orgId}/forms`}
          className="flex justify-center items-center gap-2 hover:text-muted-foreground text-sm">
          <ChevronLeftIcon className="w-4 h-4" />
          {t("label_go_back")}
        </Link>
      </div>
    </div>
  );
};
const OrganizationNavbar = () => {
  const t = useTranslations("app");
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const isActive = (path: string) => pathname.endsWith(path);

  const orgResources = [
    { name: t("label_forms"), path: `/dashboard/organizations/${orgId}/forms`, icon: LayersIcon, enabled: true },
    {
      name: t("label_analytics"),
      path: `/dashboard/organizations/${orgId}/analytics`,
      icon: ChartNoAxesColumnIcon,
      enabled: true,
    },
    {
      name: t("label_settings"),
      path: `/dashboard/organizations/${orgId}/settings`,
      icon: Settings2Icon,
      enabled: false,
    },
  ];

  return (
    <div className="border-b h-10 flex justify-start items-center gap-2 px-2 sm:px-6 overflow-x-auto fixed bg-background w-full truncate">
      {orgResources
        .filter((x) => x.enabled)
        .map((r) => {
          return (
            <Link
              key={r.name}
              href={r.path}
              className={`${
                isActive(r.path) ? "font-medium text-foreground" : "text-muted-foreground"
              } text-sm flex justify-center items-center px-2 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
              <r.icon className={`${isActive(r.path) ? "text-primary" : "text-muted-foreground"} w-4 h-4`} />
              {r.name}
              {isActive(r.path) && <div className="bg-primary/80 bottom-0 w-full h-0.5 absolute"></div>}
            </Link>
          );
        })}
    </div>
  );
};
const FormNavbar = () => {
  const t = useTranslations("app");
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const isActive = (path: string) => pathname.endsWith(path);
  const formId = pathname.split("/")[5];

  const formResources = [
    {
      name: t("label_overview"),
      path: `/dashboard/organizations/${orgId}/form/${formId}/overview`,
      icon: BarChartIcon,
      enabled: true,
    },
    {
      name: t("label_submissions"),
      path: `/dashboard/organizations/${orgId}/form/${formId}/submissions`,
      icon: SendIcon,
      enabled: true,
    },
    {
      name: t("label_share"),
      path: `/dashboard/organizations/${orgId}/form/${formId}/share`,
      icon: Share2Icon,
      enabled: true,
    },
    {
      name: t("label_settings"),
      path: `/dashboard/organizations/${orgId}/form/${formId}/settings`,
      icon: Settings2Icon,
      enabled: true,
    },
  ];
  return (
    <div className="border-b h-10 flex justify-start items-center gap-2 px-2 sm:px-6 overflow-x-auto fixed bg-background w-full truncate">
      {formResources
        .filter((x) => x.enabled)
        .map((r) => {
          return (
            <Link
              key={r.name}
              href={r.path}
              className={`${
                isActive(r.path) ? "font-medium text-foreground" : "text-muted-foreground"
              } text-sm flex justify-center items-center px-2 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
              <r.icon className={`${isActive(r.path) ? "text-primary" : "text-muted-foreground"} w-4 h-4`} />
              {r.name}
              {isActive(r.path) && <div className="bg-primary/80 bottom-0 w-full h-0.5 absolute"></div>}
            </Link>
          );
        })}
    </div>
  );
};
export default OrganizationsNavbar;
