"use client";

import { freeTrialPeriod } from "@/utils/envs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Faq = () => {
  const t = useTranslations("landing");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: t("faq1_q"),
      answer: t("faq1_a", { period: freeTrialPeriod }),
    },
    {
      question: t("faq2_q"),
      answer: t("faq2_a"),
    },
    {
      question: t("faq3_q"),
      answer: t("faq3_a"),
    },
    {
      question: t("faq4_q"),
      answer: t("faq4_a"),
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section id="faq" className="relative py-16 px-4 sm:px-6 bg-background w-full">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("faq_headline")}</h2>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.05 }}>
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`border rounded-lg p-4 transition-all ${
                activeIndex === index
                  ? "bg-background/80 border-primary/40 shadow-sm"
                  : "bg-background/80 border-muted-foreground/15 hover:border-muted-foreground/25"
              }`}>
              <button
                className="flex items-center justify-between w-full gap-3 group"
                onClick={() => toggleFaq(index)}
                aria-expanded={activeIndex === index}>
                <span
                  className={`text-left text-sm font-medium ${
                    activeIndex === index ? "text-primary" : "text-foreground group-hover:text-primary/90"
                  }`}>
                  {faq.question}
                </span>
                <div
                  className={`p-1 rounded-full transition-all ${
                    activeIndex === index
                      ? "bg-primary/10 text-primary rotate-180"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/5"
                  }`}>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="pt-3">
                      <p className="text-sm text-muted-foreground/90 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
