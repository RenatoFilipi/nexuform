"use client";

import Brand from "@/components/shared/brand";
import ModeToggle2 from "@/components/shared/mode-toggle2";
import { appName } from "@/utils/envs";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("landing");
  const currentYear = new Date().getFullYear();

  const urls = [
    { name: t("nav_features"), url: "features" },
    { name: t("nav_htw"), url: "how-it-works" },
    { name: t("nav_pricing"), url: "pricing" },
    { name: t("nav_faq"), url: "faq" },
  ];

  const legals = [
    { name: t("label_privacy"), url: "/legal/privacy" },
    { name: t("label_terms"), url: "/legal/terms" },
    { name: t("nav_cookies"), url: "/legal/terms" },
  ];

  return (
    <footer className="w-full px-6 sm:px-8 pt-12 pb-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Brand type="logo" className="h-5 fill-primary" />
          </Link>
          <p className="text-sm text-foreground/60 leading-relaxed">{t("footer_cta")}</p>
        </div>

        {/* Empty Spacer (hidden) */}
        <div className="hidden md:block" />

        {/* Product Links */}
        <div>
          <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-3">
            {t("label_product")}
          </h3>
          <ul className="space-y-2">
            {urls.map((item) => (
              <li key={item.name}>
                <Link
                  href={`#${item.url}`}
                  className="text-xs text-foreground/60 hover:text-primary transition-colors duration-200">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + Mode Toggle */}
        <div>
          <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-3">{t("label_legal")}</h3>
          <ul className="space-y-2">
            {legals.map((l) => {
              return (
                <li key={l.name}>
                  <Link
                    href={l.url}
                    className="text-xs text-foreground/60 hover:text-primary transition-colors duration-200">
                    {l.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-foreground/50">
          &copy; {currentYear} {appName}.
        </p>
        <ModeToggle2 />
      </div>
    </footer>
  );
};

export default Footer;
