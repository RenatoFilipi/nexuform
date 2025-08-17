"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChartIcon, CheckIcon, LayersIcon, Share2Icon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("landing");

  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
      color: "text-indigo-500",
      bgColor: "bg-indigo-500",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-green-500",
      bgColor: "bg-green-500",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 w-full bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 space-y-6">
          <div className="flex justify-center items-center gap-3 text-primary">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ZapIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium uppercase tracking-[0.2em]">{t("htw_preheadline")}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t("htw_headline")} <span className="text-primary">{t("htw_headline_highlight")}</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("htw_subheadline")}{" "}
            <span className="text-foreground font-semibold">{t("htw_subheadline_highlight")}</span>
          </p>
        </motion.div>

        <div className="relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative z-10 flex gap-8 mb-12 flex-col sm:flex-row">
              {/* Ponto do passo */}
              <div className="relative z-10 h-fit flex justify-center items-center sm:justify-start">
                {/* Anel externo translucido */}
                <div className="absolute -inset-2 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md shadow-lg" />

                {/* Círculo principal */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl shadow-md border border-white/20 relative">
                  {/* Glow interno */}
                  <div className={`absolute inset-0 rounded-full ${step.bgColor} opacity-20 blur-lg`} />
                  {/* Ícone */}
                  <step.icon className={`w-6 h-6 ${step.color} relative z-10`} />
                </div>
              </div>

              {/* Card */}
              <Card className="flex-1 p-6 rounded-xl bg-gradient-to-br from-card to-card/60 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
                <ul className="mt-4 space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={`p-1 rounded-full ${step.bgColor}`}>
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
