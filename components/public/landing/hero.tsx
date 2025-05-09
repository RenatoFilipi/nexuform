"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon, CreditCardIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <div className="relative flex flex-col justify-center items-center gap-8 md:gap-14 min-h-[calc(100dvh-64px)] w-full px-4 sm:px-8 overflow-hidden pt-36 pb-8">
      <BgDesign />
      <motion.div
        className="flex justify-center items-center flex-col gap-6 md:gap-8 w-full z-10 relative max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <CtaBadge />
        <motion.div
          className="flex flex-col justify-center items-center w-full text-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}>
          <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-5xl max-w-4xl md:max-w-6xl leading-tight md:leading-snug bg-clip-text text-transparent bg-gradient-to-r from-foreground/90 to-foreground/60">
            {t.rich("hero_headline", {
              main: (chunks) => (
                <span className="relative">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    {chunks}
                  </span>
                </span>
              ),
            })}
          </h1>
          <p className="max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg font-normal text-foreground/70">
            {t("hero_subheadline")}
          </p>
        </motion.div>
        <CtaActions />
        <CtaImage />
      </motion.div>
    </div>
  );
};

const BgDesign = () => (
  <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
    <div className="absolute -bottom-[300px] w-full h-[850px] rounded-full dark:bg-primary/30 bg-primary/15 blur-3xl animate-float-delay" />
  </div>
);

const CtaBadge = () => {
  const t = useTranslations("landing");
  return (
    <motion.div
      className="flex border border-primary/15 py-1.5 px-2.5 rounded bg-primary/5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}>
      <span className="text-primary text-sm font-medium flex justify-center items-center gap-2">
        <RocketIcon className="w-4 h-4" />
        {t("hero_badge")}
      </span>
    </motion.div>
  );
};

const CtaActions = () => {
  const t = useTranslations("landing");
  return (
    <motion.div
      className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}>
      <Button asChild className="group transition-all">
        <Link href="/signup">
          {t("hero_get_started")}
          <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
      <div className="flex justify-center items-center gap-2 text-sm text-foreground/70">
        <CreditCardIcon className="w-4 h-4" />
        <span>{t("hero_no_card")}</span>
      </div>
    </motion.div>
  );
};

const CtaImage = () => {
  return (
    <motion.div
      className="relative w-full max-w-5xl h-64 sm:h-80 md:h-96 lg:h-[500px] mt-4 md:mt-8 rounded-2xl overflow-hidden shadow-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/40 z-10 pointer-events-none rounded-2xl" />
      <Image
        src="/hero.png"
        alt="Hero image"
        fill
        className="object-cover object-center rounded-2xl"
        priority
        quality={100}
      />
    </motion.div>
  );
};

export default Hero;
