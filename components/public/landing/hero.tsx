"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon, CheckIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden py-20 md:pt-48 pb-0 w-full">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute -bottom-[150px] w-full h-[450px] rounded-full dark:bg-primary/40 bg-primary/30 blur-3xl animate-float-delay hidden sm:flex" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background/10 to-background" />
      </div>
      <motion.div
        className="container relative px-4 md:px-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant={"primary"} className="mb-6">
            <ZapIcon className="mr-1 h-3 w-3" />
            {t("hero_badge")}
          </Badge>
          <h1 className="font-semibold text-4xl sm:text-5xl leading-tight">
            {t.rich("hero_headline", {
              main: (chunks) => (
                <span className="relative">
                  <span className="relative z-10 text-primary">{chunks}</span>
                </span>
              ),
            })}
          </h1>
          <p className="mx-auto mb-12 mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("hero_subheadline")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="group transition-all hover:shadow-lg hover:shadow-primary/20"
              size="default"
              variant={"secondary"}>
              <Link href="/signup">
                {t("hero_get_started")}
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="mt-24 flex items-center justify-center gap-8 text-sm text-muted-foreground">
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
          <div className="relative mt-8 overflow-hidden">
            <div className="relative mx-auto max-w-5xl">
              <div className="relative rounded-t-2xl border border-b-0 border-foreground/20 bg-foreground/5 p-2 shadow-2xl h-80 overflow-hidden">
                <Image
                  width={1912}
                  height={932}
                  loading="lazy"
                  src="/hero-d.png"
                  alt="NexuForm"
                  className="w-full rounded-t-xl object-cover object-top"
                />
              </div>
              {/* Fade overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/60 via-primary/30 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
