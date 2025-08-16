"use client";

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
      color: "text-blue-500",
      accent: "from-blue-500/30 to-blue-500/5",
    },
    {
      title: t("usecases_2_title"),
      description: t("usecases_2_desc"),
      icon: BarChart3Icon,
      color: "text-purple-500",
      accent: "from-purple-500/30 to-purple-500/5",
    },
    {
      title: t("usecases_3_title"),
      description: t("usecases_3_desc"),
      icon: BugIcon,
      color: "text-green-500",
      accent: "from-green-500/30 to-green-500/5",
    },
    {
      title: t("usecases_4_title"),
      description: t("usecases_4_desc"),
      icon: UserCheckIcon,
      color: "text-pink-500",
      accent: "from-pink-500/30 to-pink-500/5",
    },
    {
      title: t("usecases_5_title"),
      description: t("usecases_5_desc"),
      icon: ShieldIcon,
      color: "text-orange-500",
      accent: "from-orange-500/30 to-orange-500/5",
    },
    {
      title: t("usecases_6_title"),
      description: t("usecases_6_desc"),
      icon: ZapIcon,
      color: "text-yellow-500",
      accent: "from-yellow-500/30 to-yellow-500/5",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: {
      y: -3,
      scale: 1.02,
      boxShadow: "0 15px 40px -10px rgba(0,0,0,0.15)",
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.1 },
  };

  return (
    <section id="usecases" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{t("usecases_headline")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("usecases_subheadline")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ucs.map((uc, i) => (
            <motion.div key={i} variants={cardVariants} whileHover="hover">
              <Card
                className={`relative h-full p-6 rounded-2xl border border-white/10 
                  bg-gradient-to-b from-background to-background/50 
                  backdrop-blur-sm transition-all duration-300`}>
                {/* Glow Border on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 border-transparent 
                    bg-gradient-to-br ${uc.accent} opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <motion.div
                    variants={iconVariants}
                    className={`w-14 h-14 flex items-center justify-center rounded-xl 
                      bg-gradient-to-br ${uc.accent} ${uc.color} shadow-lg`}>
                    <uc.icon className="w-7 h-7" />
                  </motion.div>

                  <h3 className="mt-6 text-xl font-semibold">{uc.title}</h3>
                  <p className="mt-3 text-muted-foreground flex-1 leading-relaxed">{uc.description}</p>

                  <div className="mt-6 h-[2px] w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
