"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BarChartIcon, BlocksIcon, DatabaseIcon, HexagonIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const Features = () => {
  const t = useTranslations("landing");
  const features = [
    {
      title: t("feat1_headline"),
      description: t("feat1_subheadline"),
      icon: BlocksIcon,
      color: "text-blue-500",
      borderColor: "hover:border-blue-300",
      accent: "bg-blue-500",
      bgColor: "bg-blue-500/5",
    },
    {
      title: t("feat2_headline"),
      description: t("feat2_subheadline"),
      icon: BarChartIcon,
      color: "text-purple-500",
      borderColor: "hover:border-purple-300",
      accent: "bg-purple-500",
      bgColor: "bg-purple-500/5",
    },
    {
      title: t("feat3_headline"),
      description: t("feat3_subheadline"),
      icon: DatabaseIcon,
      color: "text-green-500",
      borderColor: "hover:border-green-300",
      accent: "bg-green-500",
      bgColor: "bg-green-500/5",
    },
    {
      title: t("feat4_headline"),
      description: t("feat4_subheadline"),
      icon: HexagonIcon,
      color: "text-orange-500",
      borderColor: "hover:border-orange-300",
      accent: "bg-orange-500",
      bgColor: "bg-orange-500/5",
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -8,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
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
      rotate: 5,
      scale: 1.1,
    },
  };

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <Badge
            variant={"primary"}
            className="text-primary border-primary/30 dark:border-primary/50 px-3 py-1 text-sm">
            {t("nav_features")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">{t("feat_headline")}</h2>
          <p className="text-lg text-muted-foreground/80 leading-relaxed">{t("feat_subheadline")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover" className="h-full">
              <div
                className={`relative h-full rounded-2xl border border-muted/50 ${feature.borderColor} ${feature.bgColor} p-8 transition-all duration-300 group hover:shadow-lg overflow-hidden`}>
                {/* Floating gradient background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.05, scale: 1.2 }}
                  className={`absolute -inset-8 rounded-full ${feature.color.replace(
                    "text",
                    "bg"
                  )} opacity-0 blur-3xl transition-opacity duration-500`}
                />

                <div className="relative z-10 flex flex-col gap-6 h-full">
                  <div className="flex flex-col gap-4">
                    <motion.div
                      variants={iconVariants}
                      className={`p-3 rounded-xl ${feature.bgColor} w-fit shadow-sm border border-muted/20`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <motion.p
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="text-muted-foreground/80 leading-relaxed">
                    {feature.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
