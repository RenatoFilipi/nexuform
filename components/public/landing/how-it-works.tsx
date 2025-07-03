"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckIcon, LayersIcon, SendIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

const HowItWorks = () => {
  const t = useTranslations("landing");

  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      activeBgColor: "bg-blue-500/20",
      cardBg: "bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500",
      shadow: "hover:shadow-blue-500/20",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      activeBgColor: "bg-emerald-500/20",
      cardBg: "bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500",
      shadow: "hover:shadow-emerald-500/20",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: SendIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      activeBgColor: "bg-orange-500/20",
      cardBg: "bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500",
      shadow: "hover:shadow-orange-500/20",
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };
  const iconContainerVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  };
  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1.1, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section id="how-it-works" className="relative py-28 px-4 w-full bg-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <Badge
            variant={"primary"}
            className="text-primary border-primary/30 dark:border-primary/50 px-3 py-1 text-xs">
            {t("nav_htw")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-background">{t("htw_headline")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("htw_subheadline")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              initial="visible"
              className={`relative rounded-xl p-8 ${step.cardBg} group border ${step.borderColor} shadow-sm ${step.shadow} transition-all duration-300 h-full flex flex-col`}>
              <div className="flex-1 mb-6">
                <h3 className={`text-xl font-semibold mb-3 ${step.color}`}>{step.title}</h3>
                <p className="text-background mb-5 text-sm leading-relaxed">{step.description}</p>

                <ul className="space-y-3">
                  {step.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 3 }}
                      className="flex items-start gap-2">
                      <div
                        className={`flex-shrink-0 mt-1 p-1 rounded-full ${step.bgColor} group-hover:${step.activeBgColor} transition-colors`}>
                        <CheckIcon className={`h-3.5 w-3.5 ${step.color}`} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-background transition-colors">
                        {detail}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                variants={iconContainerVariants}
                className={`flex justify-center items-center p-6 ${step.bgColor} rounded-xl mt-auto group-hover:${step.activeBgColor} transition-colors`}>
                <motion.div variants={iconVariants} className="p-3">
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </motion.div>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden rounded-xl blur-lg">
                <div
                  className={`absolute -right-10 -top-10 w-20 h-20 rounded-full ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
