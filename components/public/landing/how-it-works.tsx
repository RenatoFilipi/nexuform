"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRightIcon, BarChartIcon, CheckIcon, LayersIcon, Share2Icon, SparklesIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const HowItWorks = () => {
  const t = useTranslations("landing");

  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
      color: "text-indigo-600 dark:text-indigo-200",
      bgColor: "bg-indigo-600 dark:bg-indigo-200",
      hoverColor: "hover:border-indigo-300 dark:hover:border-indigo-500",
      accent: "from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-600",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-green-600 dark:text-green-200",
      bgColor: "bg-green-600 dark:bg-green-200",
      hoverColor: "hover:border-green-300 dark:hover:border-green-500",
      accent: "from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-600",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-yellow-600 dark:text-yellow-200",
      bgColor: "bg-yellow-600 dark:bg-yellow-200",
      hoverColor: "hover:border-yellow-300 dark:hover:border-yellow-500",
      accent: "from-yellow-100 to-amber-100 dark:from-yellow-800 dark:to-amber-600",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4 w-full">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-6">
          <div className="flex justify-center items-center gap-3 text-amber-500 dark:text-amber-400">
            <ZapIcon className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">{t("htw_preheadline")}</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">{t("htw_headline")} </h2>
          <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500 font-bold">
            {t("htw_headline_highlight")}
          </span>
          <p className="text-lg text-muted-foreground">
            {t("htw_subheadline")}{" "}
            <span className="text-foreground font-semibold">{t("htw_subheadline_highlight")}</span>
          </p>
        </motion.div>

        {/* Vertical Process Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-indigo-200 via-green-200 to-yellow-200 dark:from-indigo-800 dark:via-green-800 dark:to-yellow-800" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative pl-16 pb-12 last:pb-0 group">
              {/* Step number and icon */}
              <div className="absolute left-0 flex items-center justify-center w-16 h-16">
                <div className={`absolute w-4 h-4 rounded-full ${step.bgColor} z-10`} />
                <div
                  className={`absolute w-16 h-16 rounded-full ${step.bgColor} opacity-10 group-hover:opacity-20 transition-all duration-300`}
                />
                <div className="flex items-center justify-center w-12 h-12 bg-background rounded-full border-4 border-background z-20 group-hover:scale-110 transition-transform duration-300">
                  <step.icon
                    className={`w-6 h-6 ${step.color} group-hover:scale-125 transition-transform duration-300`}
                  />
                </div>
              </div>

              {/* Step content */}
              <Card
                className={`p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ml-6 border-2 border-transparent ${step.hoverColor} hover:-translate-y-1 group-hover:bg-gradient-to-br group-hover:from-card group-hover:to-card/70 dark:group-hover:to-card/90`}>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      step.color
                    } bg-opacity-10 ${step.color.replace(
                      "text",
                      "bg"
                    )} group-hover:bg-opacity-20 transition-all duration-300`}>
                    {t("label_step")} {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-gradient group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-300">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-4 text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {step.description}
                </p>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className={`w-4 h-4 ${step.color} group-hover:animate-pulse`} />
                    <span
                      className={`text-sm font-medium ${step.color} group-hover:underline decoration-wavy decoration-1 underline-offset-4 transition-all duration-300`}>
                      {t("htw_benefits_title")}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex gap-3 items-start group-hover:translate-x-1 transition-transform duration-300">
                        <div
                          className={`p-1 mt-0.5 rounded-full ${step.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <CheckIcon className={`w-4 h-4 text-background`} />
                        </div>
                        <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
