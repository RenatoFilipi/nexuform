"use client";

import { useState } from "react";

const faqData = [
  {
    question: "What is the Free Trial?",
    answer:
      "The Free Trial allows you to use the platform with limited features for 14 days without any cost.",
  },
  {
    question: "What happens after the Free Trial ends?",
    answer:
      "Once the Free Trial ends, you will need to choose a paid plan to continue accessing the platform.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings.",
  },
  {
    question: "Do you offer support?",
    answer:
      "Yes, we offer email support for the Free Trial and priority or premium support for paid plans.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) =>
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

  return (
    <div id="faq" className="px-4 pb-12 w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-center sm:text-4xl">
        Frequently Asked Questions
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
