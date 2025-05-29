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
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section
      id="features"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-5">
          <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/20 transition-colors">
            {t("nav_features")}
          </Badge>
          <h2 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            {t("feat_headline")}
          </h2>
          <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground/70 leading-relaxed">
            {t("feat_subheadline")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover" className="group relative h-full">
              <div
                className={`relative overflow-hidden rounded-2xl border ${feature.borderColor} ${feature.bgColor} p-8 transition-all duration-300 hover:shadow-lg backdrop-blur-sm h-full flex flex-col`}>
                {/* Animated accent bar */}
                <div className={`h-1.5 ${feature.accent} w-full absolute top-0 left-0 overflow-hidden rounded-t-2xl`}>
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{
                      duration: 2.5,
                      delay: index * 0.3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-white/30 w-full"
                  />
                </div>

                {/* Floating gradient background */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.1 }}
                  whileHover={{ opacity: 0.15 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${feature.color} blur-xl`}
                />

                <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4">
                    <motion.div
                      variants={iconVariants}
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg flex-shrink-0`}>
                      <feature.icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">{feature.title}</h3>
                  </div>
                  <motion.p
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 3 }}
                    className="text-muted-foreground dark:text-muted-foreground/80 leading-relaxed text-left flex-1">
                    {feature.description}
                  </motion.p>
                </div>

                {/* Subtle glow effect on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                  className={`absolute inset-0 rounded-2xl ${feature.color} blur-md transition-opacity duration-300 pointer-events-none`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
