"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-32 sm:py-40 flex justify-center items-center px-4">
      {/* DIV de efeito de iluminação atrás */}
      <div className="absolute -z-10 max-w-6xl w-full h-44 bg-primary rounded-full blur-3xl opacity-5 dark:opacity-20 animate-blob"></div>

      <motion.div
        className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-2 z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <motion.span
          className="uppercase tracking-wider text-xs font-mono text-foreground/70"
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          {t("cta_label")}
        </motion.span>

        <div className="flex flex-col gap-4">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-foreground"
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            {t("cta_headline")}
          </motion.h2>

          <motion.p
            className="text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed font-medium"
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            {t("cta_subheadline")}
          </motion.p>
        </div>

        <motion.div transition={{ delay: 0.4, duration: 0.4 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button asChild size="lg" className="text-base px-6 py-3 mt-6" variant={"default"}>
            <Link href="/signup">
              {t("cta_get_started")}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Cta;
