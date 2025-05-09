"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32 flex justify-center items-center px-4 sm:px-8">
      <BackgroundDesign />
      <motion.div
        className="max-w-7xl w-full mx-auto flex flex-col items-center text-center gap-8 z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}>
        <div className="max-w-3xl space-y-4">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-background dark:text-background"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}>
            {t("cta_headline")}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-background/90 dark:text-background/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}>
            {t("cta_subheadline")}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}>
          <Button
            asChild
            size="lg"
            className="mt-6 px-8 py-6 text-base font-medium bg-background text-foreground hover:bg-background/90 dark:bg-background dark:text-foreground dark:hover:bg-background/80 shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-xl">
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
      {/* Bolhas animadas no fundo */}
      <motion.div
        className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-[-80px] left-[-80px]"
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-[-120px] right-[-100px]"
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Cta;
