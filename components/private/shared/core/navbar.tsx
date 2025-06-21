"use client";

import { signOutAction } from "@/app/actions/auth";
import Brand from "@/components/shared/core/brand";
import ModeToggle2 from "@/components/shared/core/mode-toggle2";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import usePlatformStore from "@/stores/platform";
import useUserStore from "@/stores/user";
import { BoxesIcon, CircleHelpIcon, CircleUserIcon, MenuIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const isEditorMode = pathname.endsWith("editor");

  const isInOrg = pathname.includes("/organizations/") && pathname.split("/organizations/")[1]?.split("/")[0] !== "";

  if (isEditorMode) return <EditorNavbar />;
  if (isInOrg) return <AfterOrgNavbar />;
  return <BeforeOrgNavbar />;
};
const BeforeOrgNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`${open ? "" : "border-b"} z-10 flex flex-col bg-background fixed w-full`}>
      <div className="flex w-full justify-between items-center h-14 px-4 sm:px-6">
        {/* content */}
        <div>
          <Button variant={"ghost"} size={"icon"} className="h-8 w-8" asChild>
            <a href={"/dashboard/organizations"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </a>
          </Button>
        </div>
        {/* avatar - desk */}
        <div className="hidden sm:flex">
          <AvatarMenuDesk />
        </div>
        {/* avatar = mob */}
        <div className="sm:hidden">
          <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(!open)}>
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {open && <AvatarMenuMob />}
    </nav>
  );
};
const AfterOrgNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const orgId = pathname.split("/")[3];
  const formId = pathname.split("/")[5];
  const isFormResource = pathname.split("/")[4] === "form";
  const pf = usePlatformStore();
  const orgPath = `/dashboard/organizations/${orgId}/forms`;
  const formPath = `/dashboard/organizations/${orgId}/form/${formId}/overview`;

  return (
    <nav className="z-10 flex flex-col bg-background fixed w-full">
      <div className="flex w-full justify-between items-center h-14 px-4 sm:px-6">
        {/* content */}
        <div className="flex justify-center items-center gap-4">
          <Button variant={"ghost"} size={"icon"} className="h-8 w-8" asChild>
            <a href={"/dashboard/organizations"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </a>
          </Button>
          {pf.organizations.length > 0 && (
            <>
              <div className="flex justify-center items-center gap-4">
                <Separator orientation="vertical" className="h-5 bg-muted-foreground rotate-12" />
                <Link href={orgPath} className="text-sm font-semibold hover:bg-foreground/10 px-2 py-1 rounded">
                  {pf.organizations[0].name}
                </Link>
              </div>
              {formId && isFormResource && (
                <div className="flex justify-center items-center gap-4">
                  <Separator orientation="vertical" className="h-5 bg-muted-foreground rotate-12" />
                  <Link href={formPath} className="text-sm font-semibold hover:bg-foreground/10 px-2 py-1 rounded">
                    {pf.forms[0].name}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        {/* avatar - desk */}
        <div className="hidden sm:flex">
          <AvatarMenuDesk />
        </div>
        {/* avatar - mob */}
        <div className="sm:hidden">
          <Button variant={"ghost"} size={"icon"} onClick={() => setOpen(!open)}>
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="fixed w-full mt-14 z-20">
          <AvatarMenuMob />
        </div>
      )}
    </nav>
  );
};
const AvatarMenuDesk = () => {
  const t = useTranslations("app");
  const user = useUserStore();
  const avatarName = user.email.slice(0, 1);

  const resources = [
    { name: t("label_organizations"), path: "/dashboard/organizations", icon: BoxesIcon, enabled: true },
    { name: t("label_account"), path: "/dashboard/settings/account", icon: CircleUserIcon, enabled: true },
    { name: t("label_help"), path: "/dashboard/help", icon: CircleHelpIcon, enabled: true },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-9 h-9">
          <AvatarFallback className="bg-foreground/15 hover:bg-foreground/30 transition">
            <span className="first-letter:uppercase text-xs font-bold">{avatarName}</span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-64" align="end" sideOffset={6}>
        {user.email !== "" && (
          <>
            <div className="flex flex-col p-1">
              <span className="text-base font-semibold">{user.profile.first_name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <div className="flex flex-col gap-2 p-1">
          {resources.map((r) => {
            return (
              <a
                key={r.name}
                href={r.path}
                className="flex justify-between items-center w-full p-1 hover:bg-foreground/5 rounded">
                <span className="text-sm">{r.name}</span>
                <r.icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
        <div className="p-1 flex justify-between items-center">
          <span className="text-sm">{t("label_theme")}</span>
          <ModeToggle2 />
        </div>
        <DropdownMenuSeparator />
        <button onClick={signOutAction} className="p-1 text-sm flex w-full hover:bg-foreground/5">
          {t("label_logout")}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const AvatarMenuMob = () => {
  const t = useTranslations("app");

  const resources = [
    { name: t("label_organizations"), path: "/dashboard/organizations", icon: BoxesIcon, enabled: true },
    { name: t("label_account"), path: "/dashboard/settings/account", icon: CircleUserIcon, enabled: true },
    { name: t("label_help"), path: "/dashboard/help", icon: CircleHelpIcon, enabled: true },
  ];

  return (
    <div className="border-b flex w-full px-4 sm:px-6 pb-4 flex-col bg-background">
      <div className="flex flex-col w-full gap-2">
        {resources.map((r) => (
          <Link
            key={r.name}
            href={r.path}
            className="flex justify-between items-center group hover:bg-foreground/5 p-2 rounded">
            <span className="text-sm">{r.name}</span>
            <r.icon className="w-5 h-5" />
          </Link>
        ))}
      </div>
      <div className="p-2 flex justify-between items-center w-full">
        <span className="text-sm">{t("label_theme")}</span>
        <ModeToggle2 />
      </div>
      <button onClick={signOutAction} className="p-2 flex justify-between items-center w-full hover:bg-foreground/5">
        <span className="text-sm">{t("label_logout")}</span>
      </button>
    </div>
  );
};
const EditorNavbar = () => {
  const t = useTranslations("app");

  return (
    <nav className="z-10 flex flex-col bg-background fixed w-full border-b">
      <div className="flex w-full justify-between items-center h-14 px-4 sm:px-6">
        <div>
          <Button variant={"ghost"} size={"icon"} className="h-8 w-8" asChild>
            <a href={"/dashboard/organizations"}>
              <Brand type="logo" className="h-5 fill-foreground" />
            </a>
          </Button>
        </div>
        <div>
          <Button variant={"secondary"} size={"sm"}>
            {t("label_save_form")}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
