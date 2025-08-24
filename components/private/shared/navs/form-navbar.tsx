import { BarChartIcon, SendIcon, Settings2Icon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="border-b h-10 flex justify-start items-center gap-2 px-2 sm:px-6 overflow-x-auto fixed bg-background w-full truncate z-30">
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
              <r.icon className={`${isActive(r.path) ? "text-primary" : "text-muted-foreground"} w-4 h-4 hidden`} />
              {r.name}
              {isActive(r.path) && <div className="bg-primary/80 bottom-0 w-full h-0.5 absolute"></div>}
            </Link>
          );
        })}
    </div>
  );
};
export default FormNavbar;
