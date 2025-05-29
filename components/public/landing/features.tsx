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
    },
    {
      title: t("feat2_headline"),
      description: t("feat2_subheadline"),
      icon: BarChartIcon,
      color: "from-violet-400 to-purple-600",
      borderColor: "border-purple-400/20",
      accent: "bg-purple-500",
    },
    {
      title: t("feat3_headline"),
      description: t("feat3_subheadline"),
      icon: DatabaseIcon,
      color: "from-emerald-400 to-green-600",
      borderColor: "border-green-400/20",
      accent: "bg-green-500",
    },
    {
      title: t("feat4_headline"),
      description: t("feat4_subheadline"),
      icon: HexagonIcon,
      color: "from-amber-400 to-orange-600",
      borderColor: "border-orange-400/20",
      accent: "bg-orange-500",
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
      id="features"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10 overflow-hidden w-full">
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
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -8 }} className="group relative">
              <div
                className={`relative overflow-hidden rounded-2xl border ${feature.borderColor} bg-background/80 dark:bg-muted/5 p-8 transition-all duration-300 hover:shadow-xl backdrop-blur-sm h-full`}>
                {/* Animated accent bar */}
                <div className={`h-1.5 ${feature.accent} w-full absolute top-0 left-0 overflow-hidden`}>
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

                {/* Floating gradient background */}
                <div
                  className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Glow effect */}
                <div
                  className={`absolute -inset-px rounded-2xl ${feature.color} opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-500`}
                />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg flex-shrink-0`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">{feature.title}</h3>
                  </div>
                  <motion.p
                    whileHover={{ x: 2 }}
                    className="text-muted-foreground/90 dark:text-muted-foreground/80 leading-relaxed text-left">
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
