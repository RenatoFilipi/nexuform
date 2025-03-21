"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import ModeToggle2 from "../../core/mode-toggle2";

const Nav = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("landing");
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: t("label_login"), path: "/login" },
    { name: t("label_get_started"), path: "/signup" },
    { name: t("nav_features"), path: "#features" },
    { name: t("nav_htw"), path: "#how-it-works" },
    { name: t("nav_pricing"), path: "#pricing" },
    { name: t("nav_faq"), path: "#faq" },
  ];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className=" rounded-lg bg-popover shadow-lg p-2 w-screen">
        <div className="flex flex-col gap-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-foreground hover:bg-foreground/5 p-3 rounded-md text-sm transition-colors duration-200">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex justify-end items-center gap-4 p-3">
          <ModeToggle2 />
        </div>
        <div className="flex justify-start items-center gap-4 mt-4 p-2">
          <Link href={"/legal/privacy"} className="text-xs text-foreground/80 hover:underline transition-colors">
            {t("label_privacy")}
          </Link>
          <Link href={"/legal/terms"} className="text-xs text-foreground/80 hover:underline transition-colors">
            {t("label_terms")}
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Nav;
