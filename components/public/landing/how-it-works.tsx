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
      accent: "from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-600",
      card: "hover:border-indigo-600",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-green-600 dark:text-green-200",
      accent: "from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-600",
      card: "hover:border-green-600",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-yellow-600 dark:text-yellow-200",
      accent: "from-yellow-100 to-amber-100 dark:from-yellow-800 dark:to-amber-600",
      card: "hover:border-yellow-600",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 px-4 w-full ">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="flex justify-center items-center gap-3 text-amber-500 dark:text-amber-400">
            <ZapIcon className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">{t("htw_preheadline")}</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            {t("htw_headline")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              {t("htw_headline_highlight")}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("htw_subheadline")}{" "}
            <span className="text-foreground font-semibold">{t("htw_subheadline_highlight")}</span>
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="h-full">
              <Card
                className={`h-full p-6 rounded-2xl border border-border bg-card shadow-sm dark:shadow-none group transition-all ${step.card}`}>
                <div className={`w-fit p-4 rounded-xl bg-gradient-to-br ${step.accent} backdrop-blur-sm`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className={`w-4 h-4 ${step.color}`} />
                    <span className={`text-sm font-medium ${step.color}`}>{t("htw_benefits_title")}</span>
                  </div>
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <div className={`p-1.5 rounded-full bg-muted/60 dark:bg-muted/30`}>
                          <CheckIcon className={`w-4 h-4 ${step.color}`} />
                        </div>
                        <p className="text-sm text-muted-foreground">{detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-24 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            {t("htw_cta_text")} <span className="text-foreground font-semibold">{t("htw_cta_highlight")}</span>
          </p>
          <Button asChild size="lg" className="group transition-all text-base hover:shadow-lg hover:shadow-primary/20">
            <Link href="/signup">
              {t("htw_cta_button")}
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
