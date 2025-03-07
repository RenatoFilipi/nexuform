"use client";

import { freeTrialPeriod } from "@/utils/envs";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "What is the Free Trial?",
    answer: `The Free Trial allows you to use the platform with limited features for ${freeTrialPeriod} days without any cost.`,
  },
  {
    question: "What happens after the Free Trial ends?",
    answer: "Once the Free Trial ends, you will need to choose a paid plan to continue accessing the platform.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings.",
  },
  {
    question: "Do you offer support?",
    answer: "Yes, we offer email support for the Free Trial and priority or premium support for paid plans.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

  return (
    <div id="faq" className="my-10 w-full max-w-3xl px-8 sm:px-0 sm:min-h-screen flex justify-center items-center">
      <div className="grid gap-10 w-full">
        <h2 className="text-2xl font-bold text-center sm:text-4xl">Frequently Asked Questions</h2>
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
