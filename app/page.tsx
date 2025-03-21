import Brand from "@/components/core/brand";
import ModeToggle2 from "@/components/core/mode-toggle2";
import Nav from "@/components/public/core/nav";
import Cta from "@/components/public/landing/cta";
import Faq from "@/components/public/landing/faq";
import Features from "@/components/public/landing/features";
import Hero from "@/components/public/landing/hero";
import HowItWorks from "@/components/public/landing/how-it-works";
import Pricing from "@/components/public/landing/pricing";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const Home = async () => {
  const t = await getTranslations("landing");

  const urls = [
    { name: t("nav_features"), url: "features" },
    { name: t("nav_htw"), url: "how-it-works" },
    { name: t("nav_pricing"), url: "pricing" },
    { name: t("nav_faq"), url: "faq" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex fixed top-0 w-full justify-between sm:px-20 px-3 h-14 bg-background/80 z-20 backdrop-blur-lg items-center border-b border-b-foreground/10">
        <div className="flex justify-center items-center gap-8">
          <Link href={"/"} className="flex justify-center items-center">
            <Brand type="primary_logo_text" className="h-7 fill-foreground" />
          </Link>
          <div className="hidden sm:flex justify-center items-center gap-6">
            {urls.map((url) => {
              return (
                <Link key={url.url} href={`#${url.url}`} className="text-xs text-foreground hover:text-foreground">
                  {url.name}
                </Link>
              );
            })}
          </div>
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
        <Pricing />
        <Faq />
        <Cta />
      </div>
      <footer className="flex justify-center items-center w-full h-16">
        <div className="absolute left-4 hidden sm:flex justify-center items-center gap-2">
          <Link href={"/legal/privacy"} className="text-xs text-foreground/80 hover:underline">
            {t("label_privacy")}
          </Link>
          <Link href={"/legal/terms"} className="text-xs text-foreground/80 hover:underline">
            {t("label_terms")}
          </Link>
        </div>
        <span className="text-xs text-foreground/80 sm:text-center">
          © 2025{" "}
          <Link href="/" className="hover:underline">
            Nebulaform.
          </Link>
        </span>
        <div className="absolute right-4 hidden sm:flex">
          <ModeToggle2 />
        </div>
      </footer>
    </div>
  );
};

export default Home;
