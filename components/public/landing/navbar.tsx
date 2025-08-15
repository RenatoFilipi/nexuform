"use client";

import Brand from "@/components/shared/brand";
import ModeToggle2 from "@/components/shared/mode-toggle2";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const t = useTranslations("landing");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { name: t("label_login"), path: "/login" },
    { name: t("hero_join_wl"), path: "/signup" },
  ];
  const sections = [
    { name: t("nav_usecases"), id: "#usecases" },
    { name: t("nav_htw"), id: "#how-it-works" },
    { name: t("nav_pricing"), id: "#pricing" },
  ];
  const legals = [
    { name: t("label_privacy"), path: "/legal/privacy" },
    { name: t("label_terms"), path: "/legal/terms" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed py-3 sm:py-4 top-0 w-full px-4 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? "bg-background/90 border-b border-border/50 shadow-sm" : "bg-background/0"
      }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Brand
              type="primary_logo_text"
              className="h-5 sm:h-6 fill-foreground hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {sections.map((section) => (
              <Link
                key={section.name}
                href={section.id}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium relative group">
                {section.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="">
            <Link href="/login">{t("label_login")}</Link>
          </Button>
          <Button variant="default" size="sm" asChild className="shadow hover:shadow-md hover:shadow-primary/20">
            <Link href="/signup">{t("hero_join_wl")}</Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Button onClick={() => setOpen(!open)} variant="ghost" size="icon" className="hover:bg-primary/5">
            {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden">
            <div className="flex flex-col mt-3 pb-2 border-t border-border/50 pt-3">
              {sections.map((section) => (
                <Link
                  href={section.id}
                  key={section.name}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
                  {section.name}
                </Link>
              ))}
              {links.map((link) => (
                <Link
                  href={link.path}
                  key={link.name}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-start items-center gap-4 mt-2 p-3 border-t border-border/50">
              {legals.map((legal) => (
                <Link
                  href={legal.path}
                  key={legal.name}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {legal.name}
                </Link>
              ))}
              <ModeToggle2 />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
