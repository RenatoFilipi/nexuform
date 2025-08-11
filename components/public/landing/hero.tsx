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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/15 to-background py-24 md:py-36">
      <motion.div
        className="container relative px-4 md:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="mx-auto max-w-5xl text-center">
          <Badge className="mb-5 px-3 py-1.5 text-sm rounded-full shadow">
            <ZapIcon className="mr-1 h-4 w-4" />
            {t("hero_badge")}
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            {t.rich("hero_headline", {
              main: (chunks) => (
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary decoration-primary/30 decoration-4 underline-offset-8">
                    {chunks}
                  </span>
                </span>
              ),
            })}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">{t("hero_subheadline")}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="group transition-all hover:shadow-lg hover:shadow-primary/30 text-base px-6 py-3"
              size="lg"
              variant="default">
              {/* <Link href="/signup">{t("hero_get_started")}</Link> */}
              <Link href="/signup">{t("hero_join_wl")}</Link>
            </Button>
            <Button
              asChild
              className="group transition-all hover:shadow-lg hover:shadow-primary/30 text-base px-6 py-3"
              size="lg"
              variant="secondary">
              <a href={`/s/${DEMO_ID}`}>
                {t("hero_check_demo")}
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
