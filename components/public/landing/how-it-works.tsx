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
      color: "from-sky-400 to-blue-600",
      bgColor: "bg-sky-100/80 dark:bg-blue-900/20",
      accent: "bg-blue-500",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: DatabaseIcon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "from-emerald-400 to-green-600",
      bgColor: "bg-emerald-100/80 dark:bg-green-900/20",
      accent: "bg-green-500",
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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="how-it-works"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/10 dark:from-background dark:to-muted/5 overflow-hidden w-full">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-5">
          <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/20 transition-colors">
            {t("nav_htw")}
          </Badge>
          <h2 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            {t("htw_headline")}
          </h2>
          <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground/70 leading-relaxed">
            {t("htw_subheadline")}
          </p>
        </motion.div>

        {/* Animated cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="group relative h-full"
              whileHover={{ y: -5 }}>
              <Card className="h-full overflow-hidden border-0 shadow-xl dark:shadow-lg dark:shadow-purple-500/10 dark:border dark:border-muted/30 bg-background/90 dark:bg-muted/5 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl">
                {/* Animated accent bar */}
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
                    className="absolute inset-0 bg-white/30 w-full"
                  />
                </div>

                <div className={`p-8 ${step.bgColor} transition-colors duration-500 relative`}>
                  {/* Floating icon background */}
                  <div
                    className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${step.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  <div className="flex items-start gap-5 relative z-10">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-lg flex-shrink-0`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground dark:text-foreground">
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                          {index + 1}.
                        </span>{" "}
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground dark:text-muted-foreground mt-2 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-5 bg-background/90 dark:bg-muted/5">
                  <ul className="space-y-4">
                    {step.details.map((detail, i) => (
                      <motion.li key={detail} whileHover={{ x: 5 }} className="flex items-start gap-4 group">
                        <div
                          className={`flex-shrink-0 mt-1 p-1.5 rounded-full ${step.bgColor} group-hover:bg-gradient-to-br ${step.color} transition-all duration-300`}>
                          <CheckIcon
                            className={`h-4 w-4 ${
                              i === 0 ? step.color.split(" ")[0].replace("from-", "text-") : "text-muted-foreground"
                            } group-hover:text-white transition-colors duration-300`}
                          />
                        </div>
                        <p className="text-foreground/90 dark:text-foreground/80 text-base leading-relaxed">{detail}</p>
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
