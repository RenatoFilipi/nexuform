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
      color: "from-sky-400 to-blue-600",
      borderColor: "border-blue-400/20",
      accent: "bg-blue-500",
      bgColor: "bg-blue-50/50 dark:bg-blue-900/10",
    },
    {
      title: t("feat2_headline"),
      description: t("feat2_subheadline"),
      icon: BarChartIcon,
      color: "from-violet-400 to-purple-600",
      borderColor: "border-purple-400/20",
      accent: "bg-purple-500",
      bgColor: "bg-purple-50/50 dark:bg-purple-900/10",
    },
    {
      title: t("feat3_headline"),
      description: t("feat3_subheadline"),
      icon: DatabaseIcon,
      color: "from-emerald-400 to-green-600",
      borderColor: "border-green-400/20",
      accent: "bg-green-500",
      bgColor: "bg-green-50/50 dark:bg-green-900/10",
    },
    {
      title: t("feat4_headline"),
      description: t("feat4_subheadline"),
      icon: HexagonIcon,
      color: "from-amber-400 to-orange-600",
      borderColor: "border-orange-400/20",
      accent: "bg-orange-500",
      bgColor: "bg-orange-50/50 dark:bg-orange-900/10",
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
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -4,
      transition: {
        duration: 0.2,
      },
    },
  };
  const iconVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "backOut",
      },
    },
    hover: {
      scale: 1.05,
    },
  };

  return (
    <section id="features" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <Badge className="text-primary border-primary/30 dark:border-primary/50 px-3 py-1 text-xs">
            {t("nav_features")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("feat_headline")}</h2>
          <p className="text-muted-foreground/80 leading-relaxed">{t("feat_subheadline")}</p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover" className="h-full">
              <div
                className={`relative h-full rounded-xl border ${feature.borderColor} ${feature.bgColor} p-6 transition-all duration-200 group hover:border-${feature.accent}/30 overflow-hidden`}>
                {/* Animated accent */}
                <div className={`absolute top-0 left-0 h-1 w-full ${feature.accent}`}>
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

                {/* Gradient highlight on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  className={`absolute inset-0 ${feature.color} opacity-0 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex flex-col gap-4 h-full">
                  <div className="flex items-start gap-3">
                    <motion.div
                      variants={iconVariants}
                      className={`p-2.5 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-sm`}>
                      <feature.icon className="h-5 w-5" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mt-1">{feature.title}</h3>
                  </div>
                  <motion.p
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                    className="text-sm text-muted-foreground/80 leading-relaxed">
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
