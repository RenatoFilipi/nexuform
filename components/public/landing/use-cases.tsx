"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BarChart3Icon, BugIcon, ShieldIcon, UserCheckIcon, UsersIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const UseCases = () => {
  const t = useTranslations("landing");

  const ucs = [
    {
      title: t("usecases_1_title"),
      description: t("usecases_1_desc"),
      icon: UsersIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "bg-transparent hover:bg-primary/5",
    },
    {
      title: t("usecases_2_title"),
      description: t("usecases_2_desc"),
      icon: BarChart3Icon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "bg-transparent hover:bg-primary/5",
    },
    {
      title: t("usecases_3_title"),
      description: t("usecases_3_desc"),
      icon: BugIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "bg-transparent hover:bg-primary/5",
    },
    {
      title: t("usecases_4_title"),
      description: t("usecases_4_desc"),
      icon: UserCheckIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "bg-transparent hover:bg-primary/5",
    },
    {
      title: t("usecases_5_title"),
      description: t("usecases_5_desc"),
      icon: ShieldIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "bg-transparent hover:bg-primary/5",
    },
    {
      title: t("usecases_6_title"),
      description: t("usecases_6_desc"),
      icon: ZapIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "bg-transparent hover:bg-primary/5",
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
      scale: 1.1,
    },
  };

  return (
    <section id="usecases" className="relative py-40 px-4 sm:px-6 lg:px-8 bg-background">
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
            {t("nav_usecases")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">{t("usecases_headline")}</h2>
          <p className="text-lg text-muted-foreground/80 leading-relaxed">{t("usecases_subheadline")}</p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ucs.map((uc, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover" className="h-full">
              <div
                className={`relative h-full rounded-xl border ${uc.borderColor} ${uc.bgColor} p-8 transition-all duration-300 group hover:shadow-lg overflow-hidden`}>
                {/* Floating gradient background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.05, scale: 1.2 }}
                  className={`absolute -inset-8 rounded-full ${uc.color.replace(
                    "text",
                    "bg"
                  )} opacity-0 blur-3xl transition-opacity duration-500`}
                />

                <div className="relative z-10 flex flex-col gap-6 h-full">
                  <div className="flex flex-col gap-4">
                    <motion.div
                      variants={iconVariants}
                      className={`p-3 rounded-xl ${uc.bgColor} w-fit shadow-sm border border-muted-foreground/15 group-hover:border-primary/60`}>
                      <uc.icon className={`h-6 w-6 ${uc.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground">{uc.title}</h3>
                  </div>
                  <motion.p
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="text-muted-foreground leading-relaxed group-hover:text-foreground">
                    {uc.description}
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

export default UseCases;
