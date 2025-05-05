"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32 flex justify-center items-center px-4 sm:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 dark:from-primary/90 dark:to-primary/70" />
      </div>
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center text-center gap-6 z-10">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight text-background dark:text-background">
            {t("cta_headline")}
          </h2>
          <p className="text-lg text-background/90 dark:text-background/80 sm:text-xl">{t("cta_subheadline")}</p>
        </div>
        <Button
          asChild
          size="lg"
          className="mt-6 px-8 py-6 text-base font-medium bg-background text-foreground hover:bg-background/90 dark:bg-background dark:text-foreground dark:hover:bg-background/80 shadow-lg hover:shadow-primary/20 transition-all">
          <Link href={"/signup"}>
            {t("cta_get_started")} <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Cta;
