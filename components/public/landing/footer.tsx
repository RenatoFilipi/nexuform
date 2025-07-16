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
    { name: t("nav_usecases"), url: "usecases" },
    { name: t("nav_pricing"), url: "pricing" },
    { name: t("nav_faq"), url: "faq" },
  ];

  const legals = [
    { name: t("label_privacy"), url: "/legal/privacy" },
    { name: t("label_terms"), url: "/legal/terms" },
    { name: t("nav_cookies"), url: "/legal/cookies" },
  ];

  return (
    <footer className="w-full px-6 sm:px-8 py-16 dark:bg-black text-foreground">
      <div className="max-w-7xl mx-auto flex justify-between items-start flex-col sm:flex-row gap-8">
        {/* Branding + CTA */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Brand type="logo_text" className="h-4 fill-foreground" />
          </Link>
          <p className="text-sm text-foreground/60 mb-4 leading-relaxed">{t("footer_cta")}</p>
        </div>
        {/* Product Links */}
        <div className="flex flex-col gap-3">
          <h3 className="uppercase tracking-tighter text-xs text-muted-foreground font-medium">{t("label_product")}</h3>
          <ul className="flex flex-col gap-1">
            {urls.map((item) => (
              <li key={item.name}>
                <Link
                  href={`#${item.url}`}
                  className="text-sm text-foreground hover:text-primary transition-colors duration-200">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-4 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row">
          <div className="flex gap-4 text-xs text-foreground/50">
            {legals.map((link) => (
              <Link key={link.name} href={link.url} className="hover:text-muted-foreground transition text-foreground">
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-xs text-foreground/50">
            &copy; {currentYear} {appName}.
          </p>
        </div>
        <ModeToggle2 />
      </div>
    </footer>
  );
};

export default Footer;
