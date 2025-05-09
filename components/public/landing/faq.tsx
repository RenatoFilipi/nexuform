"use client";

import { freeTrialPeriod } from "@/utils/envs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Faq = () => {
  const t = useTranslations("landing");
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-36 w-full bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            {t("faq_headline")}
          </h2>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}>
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`border rounded-xl p-6 transition-all duration-200 ${
                activeIndex === index
                  ? "bg-background/80 dark:bg-muted/5 border-primary/50 shadow-lg dark:shadow-primary/10 backdrop-blur-sm"
                  : "bg-background/80 dark:bg-muted/5 border-muted-foreground/20 hover:border-muted-foreground/30 backdrop-blur-sm"
              }`}
              whileHover={{ y: -2 }}>
              <button
                className="flex items-center justify-between w-full text-left gap-4 group"
                onClick={() => toggleFaq(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-${index}`}>
                <span className="text-lg sm:text-xl font-medium text-foreground dark:text-foreground/90 group-hover:text-primary transition-colors">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 p-1 rounded-full transition-all ${
                    activeIndex === index
                      ? "bg-primary text-primary-foreground rotate-180"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                  <ChevronDownIcon className="w-5 h-5 transition-transform duration-200" />
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    id={`faq-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden">
                    <motion.div
                      className="pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}>
                      <p className="text-muted-foreground dark:text-muted-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
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
