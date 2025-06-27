import { ChartNoAxesColumnIcon, CreditCard, LayersIcon, Settings2Icon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      name: t("label_members"),
      path: `/dashboard/organizations/${orgId}/members`,
      icon: UsersIcon,
      enabled: true,
    },
    {
      name: t("label_billing"),
      path: `/dashboard/organizations/${orgId}/billing`,
      icon: CreditCard,
      enabled: true,
    },
    {
      name: t("label_settings"),
      path: `/dashboard/organizations/${orgId}/settings`,
      icon: Settings2Icon,
      enabled: true,
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
export default OrganizationNavbar;
