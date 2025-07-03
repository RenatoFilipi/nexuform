"use client";

import { Card } from "@/components/ui/card";
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
      color: "text-white",
      borderColor: "border-white/20 hover:border-white",
      accent: "bg-black",
      bgColor: "bg-black/30 hover:bg-black/60",
    },
    {
      title: t("step2_label"),
      description: t("step2_desc"),
      icon: Share2Icon,
      details: [t("step2_topic1"), t("step2_topic2"), t("step2_topic3")],
      color: "text-white",
      borderColor: "border-white/20 hover:border-white",
      accent: "bg-black",
      bgColor: "bg-black/30 hover:bg-black/60",
    },
    {
      title: t("step3_label"),
      description: t("step3_desc"),
      icon: SendIcon,
      details: [t("step3_topic1"), t("step3_topic2"), t("step3_topic3")],
      color: "text-white",
      borderColor: "border-white/20 hover:border-white",
      accent: "bg-black",
      bgColor: "bg-black/30 hover:bg-black/60",
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -10,
    },
  };
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
    hover: {
      scale: 1.1,
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
      scale: 1.1,
    },
  };

  return (
    <section id="how-it-works" className="relative py-44 px-4 w-full bg-primary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20 space-y-5">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}></motion.div>
          <h2 className="text-4xl font-bold tracking-tight text-white">{t("htw_headline")}</h2>
          <p className="leading-relaxed text-lg text-white/70">{t("htw_subheadline")}</p>
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
                className={`relative h-full rounded-2xl border ${s.borderColor} ${s.bgColor} p-8 transition-all duration-300 group overflow-hidden`}>
                {/* Animated gradient background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.1, scale: 1.2 }}
                  className={`absolute inset-0 rounded-full ${s.accent} opacity-0 blur-xl transition-all duration-500`}
                />

                <div className="relative z-10 flex flex-col gap-8 h-full">
                  <div className="flex flex-col gap-5">
                    <motion.div
                      variants={iconVariants}
                      className={`p-4 rounded-xl ${s.bgColor} w-fit shadow-sm border ${s.borderColor} backdrop-blur-sm`}>
                      <s.icon className={`h-7 w-7 ${s.color}`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      <span className={`mr-2 ${s.color}`}>0{index + 1}.</span>
                      {s.title}
                    </h3>
                  </div>

                  <motion.p
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="leading-relaxed text-white text-[15px]">
                    {s.description}
                  </motion.p>

                  <div className="mt-auto flex flex-col gap-4">
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
                          className={`flex justify-center items-center p-1 rounded-full ${s.bgColor} border ${s.borderColor}`}>
                          <CheckIcon className={`w-3 h-3 ${s.color}`} />
                        </motion.div>
                        <p className="text-sm text-white/60 group-hover:text-white">{d}</p>
                      </motion.div>
                    ))}
                  </div>
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
