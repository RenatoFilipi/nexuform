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
    <div id="faq" className="my-10 w-full max-w-3xl px-8 sm:px-0 sm:min-h-screen flex justify-center items-center">
      <div className="grid gap-10 w-full">
        <h2 className="text-2xl font-bold text-center sm:text-4xl">{t("faq_headline")}</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border rounded-lg p-3">
              <button className="flex items-center justify-between w-full text-left" onClick={() => toggleFaq(index)}>
                <span className="font-medium">{faq.question}</span>
                <ChevronDownIcon
                  className={`${activeIndex === index ? "rotate-180" : ""} transition-transform w-5 h-5`}
                />
              </button>
              {activeIndex === index && <p className="mt-3 text-foreground/80 text-sm">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
