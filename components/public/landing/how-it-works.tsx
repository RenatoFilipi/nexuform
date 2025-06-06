"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChartIcon, CheckIcon, DatabaseIcon, LayersIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("landing");
  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
      color: "from-violet-400 to-purple-600",
      bgColor: "bg-violet-100/80 dark:bg-purple-900/20",
      accent: "bg-purple-500",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: DatabaseIcon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "from-violet-400 to-purple-600",
      bgColor: "bg-violet-100/80 dark:bg-purple-900/20",
      accent: "bg-purple-500",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: BarChartIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "from-violet-400 to-purple-600",
      bgColor: "bg-violet-100/80 dark:bg-purple-900/20",
      accent: "bg-purple-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -6,
      transition: {
        duration: 0.2,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3,
      },
    }),
  };

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge className="text-primary border-primary/30 dark:border-primary/50 px-3 py-1 text-xs">
            {t("nav_htw")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("htw_headline")}</h2>
          <p className="text-muted-foreground/80 leading-relaxed">{t("htw_subheadline")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={cardVariants} whileHover="hover" className="h-full">
              <Card className="h-full overflow-hidden border border-muted/20 dark:border-muted/30 bg-background/90 dark:bg-muted/5 group transition-all">
                {/* Accent bar */}
                <div className={`h-1.5 ${step.accent} w-full relative overflow-hidden`}>
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      delay: index * 0.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-white/30"
                  />
                </div>

                <div className={`p-6 ${step.bgColor} transition-colors duration-300`}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg bg-gradient-to-br ${step.color} text-white shadow-sm`}>
                      <step.icon className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                          {index + 1}.
                        </span>{" "}
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <ul className="space-y-3">
                    {step.details.map((detail, i) => (
                      <motion.li
                        key={detail}
                        variants={listItemVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={i}
                        className="flex items-start gap-3">
                        <div className={`flex-shrink-0 mt-0.5 p-1 rounded-full ${step.bgColor}`}>
                          <CheckIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-foreground/90 dark:text-foreground/80 leading-relaxed">{detail}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
