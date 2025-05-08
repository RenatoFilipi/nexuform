import Nav from "@/components/public/core/nav";
import Cta from "@/components/public/landing/cta";
import Faq from "@/components/public/landing/faq";
import Features from "@/components/public/landing/features";
import Hero from "@/components/public/landing/hero";
import HowItWorks from "@/components/public/landing/how-it-works";
import Pricing from "@/components/public/landing/pricing";
import Brand from "@/components/shared/core/brand";
import ModeToggle2 from "@/components/shared/core/mode-toggle2";
import { Button } from "@/components/ui/button";
import { appName } from "@/utils/envs";
import { getPlans } from "@/utils/plans";
import { Menu } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

const Home = async () => {
  const t = await getTranslations("landing");
  const locale = await getLocale();
  const plans = await getPlans(locale);

  const urls = [
    { name: t("nav_features"), url: "features" },
    { name: t("nav_htw"), url: "how-it-works" },
    { name: t("nav_pricing"), url: "pricing" },
    { name: t("nav_faq"), url: "faq" },
  ];

  return (
    <div className="min-h-dvh flex flex-col relative">
      <div className="flex fixed top-0 w-full justify-between sm:justify-evenly sm:px-20 px-3 h-14 bg-background/80 z-20 backdrop-blur-lg items-center">
        <div className="flex justify-center items-center gap-8">
          <Link href={"/"} className="flex justify-center items-center">
            <Brand type="primary_logo_text" className="h-5 fill-foreground" />
          </Link>
        </div>
        <div className="hidden sm:flex justify-center items-center gap-6">
          {urls.map((url) => {
            return (
              <Link key={url.url} href={`#${url.url}`} className="text-xs text-foreground hover:text-foreground">
                {url.name}
              </Link>
            );
          })}
        </div>
        <div className="hidden sm:flex justify-center items-center gap-4">
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={"/login"}>{t("label_login")}</Link>
          </Button>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link href={"/signup"}>{t("label_get_started")}</Link>
          </Button>
        </div>
        <div className="flex sm:hidden">
          <Nav>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="w-6 h-6" />
            </Button>
          </Nav>
        </div>
      </div>
      <div className="relative flex flex-col justify-center items-center px-0 flex-1 gap-14">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing plans={plans} />
        <Faq />
        <Cta />
      </div>
      <footer className="w-full bg-gradient-to-b from-background to-foreground/5 py-8 px-6 sm:px-8 border-t border-foreground/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Brand type="logo" className="h-4 fill-primary" />
            </Link>
            <p className="text-sm text-foreground/70">{t("footer_cta")}</p>
          </div>
          <div className="hidden sm:flex"></div>
          {/* Links columns */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">Product</h3>
            <nav className="space-y-2">
              {urls.map((item) => (
                <Link
                  key={item.name}
                  href={`#${item.url}`}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors block">
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/90 uppercase tracking-wider">Legal</h3>
            <nav className="space-y-2">
              <Link
                href="/legal/privacy"
                className="text-sm text-foreground/70 hover:text-primary transition-colors block">
                {t("label_privacy")}
              </Link>
              <Link
                href="/legal/terms"
                className="text-sm text-foreground/70 hover:text-primary transition-colors block">
                {t("label_terms")}
              </Link>
            </nav>
            <div className="pt-2">
              <ModeToggle2 />
            </div>
          </div>
        </div>
        {/* Bottom copyright */}
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-foreground/60">© 2025 {appName}.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/legal/cookies" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              {t("nav_cookies")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
