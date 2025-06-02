"use client";

import useEditorStore from "@/stores/editor";
import { useQuery } from "@tanstack/react-query";
import { BarChartIcon, SendIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FormNav = () => {
  const t = useTranslations("app");
  const editor = useEditorStore();
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const formId = pathSegments[pathSegments.length - 2];

  const isActive = (path: string) => pathname.endsWith(path);

  const views = [
    {
      name: t("nav_overview"),
      icon: BarChartIcon,
      enabled: true,
      path: `/dashboard/forms/${formId}/overview`,
    },
    {
      name: t("nav_submissions"),
      icon: SendIcon,
      enabled: true,
      path: `/dashboard/forms/${formId}/submissions`,
    },
    {
      name: t("label_share"),
      icon: Share2Icon,
      enabled: true,
      path: `/dashboard/forms/${formId}/share`,
    },
  ];

  const query = useQuery({
    queryKey: ["editorResetData2"],
    queryFn: () => {
      editor.reset();
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="border-b h-10 flex justify-start items-center gap-2 px-2 sm:px-8 overflow-x-auto">
      {views.map((v) => {
        return (
          <Link
            key={v.name}
            href={v.path}
            className={`${
              isActive(v.path) ? "font-medium text-foreground" : "text-muted-foreground"
            } text-sm flex justify-center items-center px-2 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
            <v.icon className={`${isActive(v.path) ? "text-primary" : "text-muted-foreground"} w-4 h-4`} />
            {v.name}
            {isActive(v.path) && <div className="bg-primary/80 bottom-0 w-full h-0.5 absolute"></div>}
          </Link>
        );
      })}
    </div>
  );
};

export default FormNav;
