"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const Faq = () => {
  const t = useTranslations("landing");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) =>
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

  const faqData = [
    {
      question: t("faq.questions.0.question"),
      answer: t("faq.questions.0.answer"),
    },
    {
      question: t("faq.questions.1.question"),
      answer: t("faq.questions.1.answer"),
    },
    {
      question: t("faq.questions.2.question"),
      answer: t("faq.questions.2.answer"),
    },
    {
      question: t("faq.questions.3.question"),
      answer: t("faq.questions.3.answer"),
    },
  ];

  return (
    <div id="faq" className="px-4 pb-12 w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-center sm:text-4xl">
        {t("faq.title")}
      </h2>
      <div className="mt-8 space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-md transition-shadow hover:shadow-lg">
            <button
              className="flex items-center justify-between w-full text-left text-lg font-semibold"
              onClick={() => toggleFaq(index)}>
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeIndex === index && (
              <p className="mt-3 text-foreground/60">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
