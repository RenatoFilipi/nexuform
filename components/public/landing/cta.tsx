"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-40 flex justify-center items-center px-4">
      <BackgroundDesign />
      <motion.div
        className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-6 z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="space-y-3">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-background dark:text-background"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            {t("cta_headline")}
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-background/90 dark:text-background/80 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            {t("cta_subheadline")}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}>
          <Button
            asChild
            size="lg"
            className="mt-4 px-6 py-5 text-sm font-medium bg-background text-foreground hover:bg-background/90 dark:bg-background dark:text-foreground dark:hover:bg-background/80 shadow-lg hover:shadow-primary/20 transition-all duration-200">
            <Link href={"/signup"}>
              {t("cta_get_started")} <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

const BackgroundDesign = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 dark:from-primary/90 dark:to-primary/70" />
      {/* Modern geometric shapes */}
      <div className="absolute inset-0 opacity-10 blur-lg">
        <div className="absolute w-40 h-40 bg-foreground rounded-full top-1/4 left-1/4 mix-blend-overlay" />
        <div className="absolute w-32 h-32 bg-foreground rounded-full bottom-1/3 right-1/3 mix-blend-overlay" />
        <div className="absolute w-20 h-20 bg-foreground rounded-full top-1/3 right-1/4 mix-blend-overlay" />
      </div>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[length:40px_40px] bg-[linear-gradient(to_right,gray_1px,transparent_1px),linear-gradient(to_bottom,gray_1px,transparent_1px)]" />
    </div>
  );
};

export default Cta;
