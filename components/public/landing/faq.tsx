"use client";

import { freeTrialPeriod } from "@/utils/envs";
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
      className="py-20 sm:py-32 w-full bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("faq_headline")}</h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl p-5 transition-all duration-200 ${
                activeIndex === index
                  ? "bg-background dark:bg-muted/5 border-primary/50 shadow-sm"
                  : "bg-background dark:bg-muted/5 border-muted-foreground/20 hover:border-muted-foreground/30"
              }`}>
              <button
                className="flex items-center justify-between w-full text-left gap-4"
                onClick={() => toggleFaq(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-${index}`}>
                <span className="text-lg font-medium text-foreground dark:text-foreground/90">{faq.question}</span>
                <ChevronDownIcon
                  className={`flex-shrink-0 transition-transform duration-200 w-5 h-5 text-muted-foreground ${
                    activeIndex === index ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-${index}`}
                className={`grid transition-all duration-200 overflow-hidden ${
                  activeIndex === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                }`}>
                <div className="overflow-hidden">
                  <p className="text-muted-foreground dark:text-muted-foreground/80">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
