"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon, ClockIcon, CreditCardIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <div className="relative flex flex-col justify-center items-center gap-6 md:gap-10 min-h-[calc(100dvh-64px)] w-full px-4 overflow-hidden pt-24 pb-6">
      <BgDesign />
      <motion.div
        className="flex justify-center items-center flex-col gap-5 md:gap-10 w-full z-10 relative max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}>
        <CtaBadge />
        <motion.div
          className="flex flex-col justify-center items-center w-full text-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}>
          <h1 className="font-bold text-3xl sm:text-5xl leading-tight">
            {t.rich("hero_headline", {
              main: (chunks) => (
                <span className="relative">
                  <span className="relative z-10 text-primary">{chunks}</span>
                </span>
              ),
            })}
          </h1>
          <p className="max-w-lg md:max-w-xl text-sm sm:text-base font-normal text-muted-foreground">
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
    <div className="absolute -bottom-[200px] w-full h-[600px] rounded-full dark:bg-primary/20 bg-primary/10 blur-2xl animate-float-delay" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background/10 to-background" />
  </div>
);
const CtaBadge = () => {
  const t = useTranslations("landing");
  return (
    <motion.div
      className="flex border border-primary/20 py-1 px-2 rounded-lg bg-primary/5 backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}>
      <span className="text-primary text-xs sm:text-sm font-medium flex justify-center items-center gap-1.5">
        <ClockIcon className="w-3.5 h-3.5" />
        {t("hero_badge")}
      </span>
    </motion.div>
  );
};
const CtaActions = () => {
  const t = useTranslations("landing");
  return (
    <motion.div
      className="flex justify-center items-center gap-3 flex-col sm:flex-row w-full z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}>
      <Button asChild className="group transition-all hover:shadow-lg hover:shadow-primary/20" size="default">
        <Link href="/signup">
          {t("hero_get_started")}
          <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
      <div className="flex justify-center items-center gap-1.5 text-xs sm:text-sm text-foreground/60">
        <CreditCardIcon className="w-3.5 h-3.5" />
        <span className="">{t("hero_no_card")}</span>
      </div>
    </motion.div>
  );
};
const CtaImage = () => {
  return (
    <motion.div
      className="relative w-full max-w-4xl h-56 sm:h-72 md:h-80 lg:h-[420px] mt-3 md:mt-6 rounded-xl overflow-hidden border border-border/50 shadow-lg"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30 z-10 pointer-events-none rounded-xl" />
      <Image
        src="/hero.png"
        alt="Hero image"
        fill
        className="object-cover object-center rounded-xl"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.03))] z-0" />
    </motion.div>
  );
};

export default Hero;
