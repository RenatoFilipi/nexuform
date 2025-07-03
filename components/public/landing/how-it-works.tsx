"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRightIcon, CheckIcon, LayersIcon, SendIcon, Share2Icon, SparklesIcon, ZapIcon } from "lucide-react";
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
      color: "text-indigo-600 dark:text-indigo-300",
      borderColor: "border-indigo-200 hover:border-indigo-400 dark:border-indigo-500/30 dark:hover:border-indigo-400",
      accent: "from-indigo-100 to-purple-100 dark:from-indigo-600 dark:to-purple-600",
      bgColor:
        "bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/20 dark:hover:from-indigo-900/40 dark:hover:to-purple-900/30",
      highlight: "bg-indigo-100 dark:bg-indigo-500/10",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-teal-600 dark:text-teal-300",
      borderColor: "border-teal-200 hover:border-teal-400 dark:border-teal-500/30 dark:hover:border-teal-400",
      accent: "from-teal-100 to-emerald-100 dark:from-teal-600 dark:to-emerald-600",
      bgColor:
        "bg-gradient-to-br from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/20 dark:hover:from-teal-900/40 dark:hover:to-emerald-900/30",
      highlight: "bg-teal-100 dark:bg-teal-500/10",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: SendIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-amber-600 dark:text-amber-300",
      borderColor: "border-amber-200 hover:border-amber-400 dark:border-amber-500/30 dark:hover:border-amber-400",
      accent: "from-amber-100 to-orange-100 dark:from-amber-600 dark:to-orange-600",
      bgColor:
        "bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 dark:hover:from-amber-900/40 dark:hover:to-orange-900/30",
      highlight: "bg-amber-100 dark:bg-amber-500/10",
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -15,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    },
  };
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
    hover: {
      scale: 1.15,
    },
  };
  const checkIconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.2,
    },
  };

  return (
    <section id="how-it-works" className="relative py-28 px-4 w-full bg-foreground/10 dark:bg-black/70">
      {/* Decorative elements - only visible in dark mode */}
      <div className="absolute inset-0 overflow-hidden hidden dark:block">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-900/20 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-amber-900/20 rounded-full filter blur-3xl opacity-20" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center gap-3 mb-4">
            <ZapIcon className="w-8 h-8 text-amber-500 dark:text-amber-400" />
            <span className="text-sm font-semibold tracking-wider text-amber-500 dark:text-amber-400 uppercase">
              {t("htw_preheadline")}
            </span>
          </motion.div>
          <h2 className="text-5xl font-bold tracking-tight">
            {t("htw_headline")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              {t("htw_headline_highlight")}
            </span>
          </h2>
          <p className="text-xl leading-relaxed text-muted-foreground">
            {t("htw_subheadline")}{" "}
            <span className="text-foreground font-semibold">{t("htw_subheadline_highlight")}</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8">
          {steps.map((s, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover" className="h-full">
              <Card
                className={`relative h-full rounded-xl border ${s.borderColor} ${s.bgColor} p-8 transition-all duration-500 group overflow-hidden shadow-sm dark:shadow-none`}>
                {/* Animated gradient background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.1, scale: 1.2 }}
                  className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 blur-xl transition-all duration-700`}
                />
                <div className="relative z-10 flex flex-col gap-8 h-full">
                  <div className="flex flex-col gap-5">
                    <motion.div
                      variants={iconVariants}
                      className={`p-5 rounded-xl ${s.highlight} w-fit shadow-sm border ${s.borderColor} backdrop-blur-sm`}>
                      <s.icon className={`h-8 w-8 ${s.color}`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{s.title}</h3>
                  </div>

                  <motion.p
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="leading-relaxed text-gray-600 dark:text-gray-300 text-[16px]">
                    {s.description}
                  </motion.p>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                      <SparklesIcon className={`w-4 h-4 ${s.color}`} />
                      <span className={`text-sm font-medium ${s.color}`}>{t("htw_benefits_title")}</span>
                    </div>
                    {s.details.map((d, i) => (
                      <motion.div
                        key={d}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        viewport={{ once: true }}>
                        <motion.div
                          variants={checkIconVariants}
                          className={`flex justify-center items-center p-1.5 rounded-full ${s.highlight} border ${s.borderColor}`}>
                          <CheckIcon className={`w-4 h-4 ${s.color}`} />
                        </motion.div>
                        <p className="text-sm text-gray-600 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                          {d}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            {t("htw_cta_text")} <span className="text-foreground font-semibold">{t("htw_cta_highlight")}</span>
          </p>
          <Button
            asChild
            className="group transition-all hover:shadow-lg hover:shadow-primary/20 text-base"
            size="lg"
            variant={"default"}>
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
