"use client";

import Brand from "@/components/shared/brand";
import ModeToggle2 from "@/components/shared/mode-toggle2";
import { APP_NAME } from "@/utils/envs";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("landing");
  const currentYear = new Date().getFullYear();

  const urls = [
    { name: t("nav_usecases"), url: "usecases" },
    { name: t("nav_htw"), url: "how-it-works" },
    { name: t("nav_pricing"), url: "pricing" },
  ];

  const legals = [
    { name: t("label_privacy"), url: "/legal/privacy" },
    { name: t("label_terms"), url: "/legal/terms" },
    { name: t("nav_cookies"), url: "/legal/cookies" },
  ];

  return (
    <footer className="w-full px-6 sm:px-8 py-16 text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-12 sm:gap-8">
        {/* Branding + CTA */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Brand type="logo_text" className="h-5 fill-foreground transition-all duration-300" />
          </Link>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-sm">{t("footer_cta")}</p>
        </div>

        {/* Product Links */}
        <div className="flex flex-col gap-4">
          <h3 className="uppercase tracking-wide text-xs font-semibold text-muted-foreground">{t("label_product")}</h3>
          <ul className="flex flex-col gap-2">
            {urls.map((item) => (
              <li key={item.name}>
                <Link
                  href={`#${item.url}`}
                  className="text-sm text-foreground/80 hover:text-primary transition-colors duration-300">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-foreground/50">
          <div className="flex gap-6">
            {legals.map((link) => (
              <Link key={link.name} href={link.url} className="hover:text-primary transition-colors duration-300">
                {link.name}
              </Link>
            ))}
          </div>
          <p className="mt-2 sm:mt-0">
            &copy; {currentYear} {APP_NAME}
          </p>
        </div>

        <ModeToggle2 />
      </div>
    </footer>
  );
};

export default Footer;
