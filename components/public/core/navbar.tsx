"use client";

import Brand from "@/components/shared/core/brand";
import ModeToggle2 from "@/components/shared/core/mode-toggle2";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const t = useTranslations("landing");
  const [open, setOpen] = useState(false);

  const links = [
    { name: t("label_login"), path: "/login" },
    { name: t("label_get_started"), path: "/signup" },
  ];
  const sections = [
    { name: t("nav_features"), id: "#features" },
    { name: t("nav_htw"), id: "#how-it-works" },
    { name: t("nav_pricing"), id: "#pricing" },
    { name: t("nav_faq"), id: "#faq" },
  ];
  const legals = [
    { name: t("label_privacy"), path: "/legal/privacy" },
    { name: t("label_terms"), path: "/legal/terms" },
  ];

  return (
    <div
      className={`flex fixed top-0 w-full sm:px-20 px-3 bg-background/80 z-20 backdrop-blur-lg items-center justify-center flex-col min-h-14`}>
      <div className="w-full flex justify-between sm:justify-around h-14 items-center">
        <div className="flex justify-center items-center gap-8">
          <Link href="/" className="flex justify-center items-center">
            <Brand type="primary_logo_text" className="h-5 fill-foreground" />
          </Link>
        </div>
        <div className="hidden sm:flex justify-center items-center gap-6">
          {sections.map((section) => {
            return (
              <Link
                key={section.name}
                href={section.id}
                className="text-xs text-foreground hover:text-primary transition-colors">
                {section.name}
              </Link>
            );
          })}
        </div>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">{t("label_login")}</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/signup">{t("label_get_started")}</Link>
          </Button>
        </div>
        <div className="flex sm:hidden">
          <Button onClick={() => setOpen(!open)} variant={"ghost"} size={"icon"}>
            {open ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-0 sm:hidden mt-3 pb-2 w-full">
            {links.map((link) => {
              return (
                <Link
                  href={link.path}
                  key={link.name}
                  className="px-3 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="flex justify-end items-center gap-4">
            <ModeToggle2 />
          </div>
          <div className="flex justify-start items-center gap-4 mt-4 p-2">
            {legals.map((legal) => {
              return (
                <Link
                  href={legal.path}
                  key={legal.name}
                  className="text-xs text-foreground/80 hover:underline transition-colors">
                  {legal.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
