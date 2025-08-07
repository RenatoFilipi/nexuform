"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      bgColor: "hover:bg-primary/5",
    },
    {
      title: t("usecases_2_title"),
      description: t("usecases_2_desc"),
      icon: BarChart3Icon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "hover:bg-primary/5",
    },
    {
      title: t("usecases_3_title"),
      description: t("usecases_3_desc"),
      icon: BugIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "hover:bg-primary/5",
    },
    {
      title: t("usecases_4_title"),
      description: t("usecases_4_desc"),
      icon: UserCheckIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "hover:bg-primary/5",
    },
    {
      title: t("usecases_5_title"),
      description: t("usecases_5_desc"),
      icon: ShieldIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "hover:bg-primary/5",
    },
    {
      title: t("usecases_6_title"),
      description: t("usecases_6_desc"),
      icon: ZapIcon,
      color: "text-primary",
      borderColor: "hover:border-primary border-primary/30",
      accent: "bg-primary",
      bgColor: "hover:bg-primary/5",
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
          className="text-center mx-auto mb-16 space-y-5">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{t("usecases_headline")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("usecases_subheadline")}</p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ucs.map((uc, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover" className="h-full">
              <Card
                className={`relative h-full rounded-lg ${uc.borderColor} ${uc.bgColor} p-6 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 overflow-hidden`}>
                {/* Efeito de brilho ao passar o mouse */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.1, scale: 1.2 }}
                  className={`absolute inset-0 rounded-xl ${uc.color.replace(
                    "text",
                    "bg"
                  )} opacity-0 blur-xl transition-all duration-500`}
                />

                <div className="relative z-10 flex flex-col gap-6 h-full">
                  <div className="flex flex-col gap-4">
                    {/* Ícone com efeito mais suave */}
                    <motion.div
                      variants={iconVariants}
                      className={`p-3 rounded-lg ${uc.bgColor} w-fit shadow-md border-2 border-muted-foreground/10 group-hover:border-primary/70 group-hover:shadow-primary/20 group-hover:bg-primary/5 transition-all`}>
                      <uc.icon className={`h-7 w-7 ${uc.color}`} />
                    </motion.div>

                    {/* Título com gradiente sutil no hover */}
                    <h3 className="text-xl font-bold text-foreground group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r from-primary to-primary/70 transition-all">
                      {uc.title}
                    </h3>
                  </div>

                  {/* Descrição com animação mais suave */}
                  <motion.p
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                    className="text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    {uc.description}
                  </motion.p>

                  {/* Elemento decorativo adicional */}
                  <div className="mt-auto pt-4">
                    <div className="h-[2px] w-8 bg-muted-foreground/20 group-hover:bg-primary/80 group-hover:w-12 transition-all duration-500"></div>
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

export default UseCases;
