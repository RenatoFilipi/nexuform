"use client";

import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, ChevronDownIcon, LayersIcon, SendIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const HowItWorks = () => {
  const t = useTranslations("landing");
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: t("step1_label"),
      description: t("step1_desc"),
      icon: LayersIcon,
      details: [t("step1_topic1"), t("step1_topic2"), t("step1_topic3")],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      activeBgColor: "bg-purple-500/20",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      activeBgColor: "bg-blue-500/20",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: SendIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      activeBgColor: "bg-emerald-500/20",
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

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("htw_headline")}</h2>
          <p className="text-muted-foreground/80 leading-relaxed">{t("htw_subheadline")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div key={index} variants={stepVariants} className="relative pl-16">
                {/* Timeline dot - mais destacado */}
                <div
                  className={`absolute left-0 top-0 h-12 w-12 rounded-full flex items-center justify-center border-2 ${
                    activeStep === index
                      ? `${step.color} border-current ${step.activeBgColor}`
                      : "border-muted-foreground/30 text-muted-foreground/50"
                  } transition-all duration-300 cursor-pointer shadow-md`}
                  onClick={() => setActiveStep(index)}>
                  <step.icon className="h-5 w-5" />
                </div>

                {/* Step header - mais destacado */}
                <div
                  className={`p-6 rounded-xl border ${
                    activeStep === index
                      ? `${step.borderColor} bg-background shadow-lg ${step.activeBgColor}`
                      : "bg-muted/10 border-muted-foreground/20"
                  } transition-all duration-300 cursor-pointer hover:bg-muted/20`}
                  onClick={() => setActiveStep(index)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          activeStep === index ? `${step.color} font-bold` : "text-foreground/80"
                        } transition-colors duration-300`}>
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          activeStep === index ? "text-foreground" : "text-muted-foreground"
                        }`}>
                        {step.description}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: activeStep === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-1.5 rounded-full ${
                        activeStep === index ? `${step.bgColor} shadow-inner` : "bg-transparent"
                      }`}>
                      <ChevronDownIcon
                        className={`h-4 w-4 ${activeStep === index ? step.color : "text-muted-foreground"}`}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Step content - mais destacado */}
                <AnimatePresence>
                  {activeStep === index && (
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`overflow-hidden ${step.borderColor} border-t-0 rounded-b-xl shadow-sm`}>
                      <div className="p-6 pt-4 space-y-4">
                        <ul className="space-y-3">
                          {step.details.map((detail, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3">
                              <div className={`flex-shrink-0 mt-0.5 p-1 rounded-full ${step.bgColor} shadow-sm`}>
                                <CheckIcon className={`h-3.5 w-3.5 ${step.color}`} />
                              </div>
                              <p className="text-sm text-foreground/90 leading-relaxed">{detail}</p>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
