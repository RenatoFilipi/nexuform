"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_ID } from "@/utils/envs";
import { motion } from "framer-motion";
import { ArrowRightIcon, CheckIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-36">
      {/* Background shapes with blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-1/3 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <motion.div
        className="container relative px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="mx-auto max-w-full text-center flex flex-col justify-center items-center sm:gap-4 w-full">
          <div className="flex justify-center items-center gap-1 mb-7 px-3 h-8 text-sm rounded-lg shadow backdrop-blur-md bg-card border border-background">
            <ZapIcon className="mr-1 h-4 w-4 text-primary fill-primary" />
            <span className="text-foreground/80">{t("hero_badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            {t.rich("hero_headline", {
              main: (chunks) => (
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary decoration-primary/30 decoration-4 underline-offset-8">
                    {chunks}
                  </span>
                </span>
              ),
              br: () => <br />,
            })}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">{t("hero_subheadline")}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              asChild
              className="group transition-all hover:shadow-lg hover:shadow-primary/15 text-base px-6 py-3 w-full sm:w-fit"
              size="lg"
              variant="default">
              <Link href="/signup">{t("hero_join_wl")}</Link>
            </Button>
            <Button
              asChild
              className="group transition-all hover:shadow-lg hover:shadow-foreground/15 text-base px-6 py-3 w-full sm:w-fit"
              size="lg"
              variant="secondary">
              <a href={`/s/${DEMO_ID}`}>
                {t("hero_check_demo")}
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-500" />
              {t("hero_cta1")}
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-500" />
              {t("hero_cta2")}
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-500" />
              {t("hero_cta3")}
            </div>
          </div>
          <div className="relative mt-20 w-full">
            <div className="mx-auto max-w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="relative rounded-2xl border border-border bg-muted/10 shadow-xl p-1 backdrop-blur-xl">
                <Image
                  width={1912}
                  height={932}
                  src="/sample-hero.png"
                  alt="NexuForm"
                  className="w-full h-auto rounded-xl object-cover"
                  priority
                  unoptimized
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
