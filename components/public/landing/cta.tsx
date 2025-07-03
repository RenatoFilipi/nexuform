"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Cta = () => {
  const t = useTranslations("landing");

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32 flex justify-center items-center px-4 bg-gradient-to-br from-blue-700 via-indigo-800 to-pink-800">
      <BackgroundDesign />
      <motion.div
        className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-2 z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        {/* Texto superior em uppercase */}
        <motion.span
          className="uppercase tracking-wider text-xs font-mono text-white/70"
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          {t("cta_label")}
        </motion.span>

        <div className="flex flex-col gap-4">
          {/* Headline destacada */}
          <motion.h2
            className="text-3xl font-bold tracking-tight text-white"
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            {t("cta_headline")}
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            className="text-base text-white/70 max-w-2xl mx-auto leading-relaxed font-medium"
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            {t("cta_subheadline")}
          </motion.p>
        </div>

        {/* Botão CTA */}
        <motion.div transition={{ delay: 0.4, duration: 0.4 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button asChild size="lg" className="text-base px-6 py-3 mt-6" variant={"secondary"}>
            <Link href="/signup">
              {t("cta_get_started")}
              <ArrowUpRightIcon className="w-4 h-4 ml-2" />
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-pink-500 opacity-80" />
    </div>
  );
};

export default Cta;
