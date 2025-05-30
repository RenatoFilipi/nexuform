"use client";

import Brand from "@/components/shared/core/brand";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/stores/editor";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { useQuery } from "@tanstack/react-query";
import { ChartNoAxesColumnIcon, ChevronsUpDownIcon, CreditCardIcon, InboxIcon, Settings2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isEditorPage = pathname.includes("dashboard/editor/");
  const isCheckoutPage = pathname.includes("dashboard/checkout-result");

  if (isCheckoutPage) return <NavbarCheckout />;
  if (isEditorPage) return <NavbarEditor />;

  return <NavbarApp />;
};
const NavbarApp = () => {
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations("app");
  const pathname = usePathname();

  const global = useGlobalStore();
  const editor = useEditorStore();
  const user = useUserStore();

  const avatarName = user.email.slice(0, 1);
  const isActive = (path: string) => path === pathname;
  const isFreeTrial = user.subscription.plan === "free_trial";

  const links = [
    {
      id: 1,
      name: t("nav_dashboard"),
      path: "/dashboard/forms",
      icon: InboxIcon,
      enabled: true,
    },
    {
      id: 2,
      name: t("nav_analytics"),
      path: "/dashboard/analytics",
      icon: ChartNoAxesColumnIcon,
      enabled: true,
    },
    {
      id: 3,
      name: t("nav_settings"),
      path: "/dashboard/settings",
      icon: Settings2Icon,
      enabled: false,
    },
    {
      id: 4,
      name: t("label_billing"),
      path: "/dashboard/settings/billing",
      icon: CreditCardIcon,
      enabled: false,
    },
  ];

  const query = useQuery({
    queryKey: ["pageFormData"],
    queryFn: () => {
      editor.reset();
      const hasSelectedForm = slug !== undefined;
      return { hasSelectedForm };
    },
  });

  if (query.isPending) return null;

  return (
    <div className="h-12 flex items-center px-2 sm:px-6 justify-between z-10 bg-background fixed w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-2">
            <Button variant={"ghost"} size={"icon"} className="" asChild>
              <Link href={"/dashboard/forms"}>
                <Brand type="logo" className="h-4 fill-foreground" />
              </Link>
            </Button>
          </div>
          {query.data?.hasSelectedForm && (
            <div className="flex justify-center items-center gap-1">
              <span className="text-xs font-medium truncate max-w-[200px]">{global.form.name}</span>
              <button className="flex justify-center items-center p-1 hover:bg-foreground/5 rounded">
                <ChevronsUpDownIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="hidden sm:flex justify-center items-center gap-2 h-full">
            {links.map((link) => {
              if (link.enabled)
                return (
                  <Link
                    key={link.id}
                    href={link.path}
                    className={`${
                      isActive(link.path) ? "text-foreground/100 font-medium bg-foreground/5" : "text-foreground/70"
                    } text-xs flex justify-center items-center px-2 py-2 rounded hover:bg-foreground/5 relative gap-2`}>
                    <link.icon className={`${isActive(link.path) ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
                    {link.name}
                  </Link>
                );
            })}
          </div>
        </div>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Avatar className="cursor-pointer w-8 h-8">
            <AvatarFallback className="bg-primary">
              <span className="first-letter:uppercase text-xs">{avatarName}</span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
const NavbarCheckout = () => {
  return <></>;
};
const NavbarEditor = () => {
  return <></>;
};

export default Navbar;
