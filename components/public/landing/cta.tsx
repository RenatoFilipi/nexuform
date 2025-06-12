"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32 flex justify-center items-center px-4">
      <BackgroundDesign />
      <motion.div
        className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-8 z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <div className="space-y-4">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-background dark:text-background"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            {t("cta_headline")}
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base md:text-lg text-background/90 dark:text-background/80 max-w-2xl mx-auto leading-relaxed"
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
          transition={{ delay: 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}>
          <Button
            asChild
            size="lg"
            className="mt-2 px-8 py-6 text-base font-medium bg-background text-foreground hover:bg-background/90 dark:bg-background dark:text-foreground dark:hover:bg-background/80 shadow-lg hover:shadow-primary/30 transition-all duration-300 group">
            <Link href={"/signup"}>
              {t("cta_get_started")}{" "}
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 dark:from-primary dark:via-primary/80 dark:to-primary/60" />

      {/* Floating abstract shapes */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, ease: "easeInOut" }}>
        <motion.div
          className="absolute w-64 h-64 bg-foreground rounded-full -top-16 -left-16 mix-blend-overlay"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-48 h-48 bg-foreground rounded-full bottom-20 right-20 mix-blend-overlay"
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute w-32 h-32 bg-foreground rounded-full top-1/3 right-1/4 mix-blend-overlay"
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      {/* Subtle grid with animation */}
      <motion.div
        className="absolute inset-0 opacity-[3%] bg-[length:60px_60px] bg-[linear-gradient(to_right,gray_1px,transparent_1px),linear-gradient(to_bottom,gray_1px,transparent_1px)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Cta;
