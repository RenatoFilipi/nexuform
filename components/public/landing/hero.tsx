"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <div className="relative flex flex-col justify-center items-center gap-6 md:gap-10 min-h-dvh w-full px-4 overflow-hidden pt-44 pb-6">
      <BgDesign />
      <motion.div
        className="flex justify-center items-center flex-col gap-5 md:gap-8 w-full z-10 relative max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}>
        <CtaBadge />
        <motion.div
          className="flex flex-col justify-center items-center w-full text-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}>
          <h1 className="font-semibold text-4xl sm:text-6xl leading-tight">
            {t.rich("hero_headline", {
              main: (chunks) => (
                <span className="relative">
                  <span className="relative z-10 text-primary">{chunks}</span>
                </span>
              ),
            })}
          </h1>
          <p className="max-w-lg md:max-w-xl text-sm sm:text-lg font-medium text-foreground/80">
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
    <div className="absolute -bottom-[150px] w-full h-[700px] rounded-full dark:bg-primary/40 bg-primary/30 blur-3xl animate-float-delay hidden sm:flex" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background/10 to-background" />
  </div>
);
const CtaBadge = () => {
  const t = useTranslations("landing");
  return (
    <motion.div
      style={{ boxShadow: "0 0 14px -2px rgba(99, 102, 241, 0.6)" }}
      className="flex border border-primary/20 py-1 px-2.5 rounded-lg backdrop-blur-sm justify-center items-center gap-2 group"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}>
      <ZapIcon className="w-3.5 h-3.5 text-foreground/60 group-hover:text-foreground transition-colors" />
      <span className="text-foreground/60 text-sm font-medium group-hover:text-foreground transition-colors">
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
