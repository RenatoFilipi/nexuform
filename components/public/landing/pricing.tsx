"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IPlan } from "@/utils/interfaces";
import { motion } from "framer-motion";
import { CheckIcon, RocketIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Pricing = ({ plans }: { plans: IPlan[] }) => {
  const t = useTranslations("landing");

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
      id="pricing"
      className="relative py-16 sm:py-28 lg:py-36 bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10 px-4 sm:px-6 overflow-hidden w-full">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto space-y-5">
          <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/20 transition-colors">
            {t("nav_pricing")}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            {t("pricing_headline")}
          </h2>
          <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground/70 leading-relaxed">
            {t("pricing_subheadline")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full mt-6">
          {plans.map((plan) => (
            <motion.div key={plan.type} variants={itemVariants} whileHover={{ y: -5 }}>
              <CardTemplate plan={plan} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CardTemplate = ({ plan }: { plan: IPlan }) => {
  const t = useTranslations("landing");

  return (
    <div
      className={`relative flex flex-col h-full p-8 rounded-lg border bg-background/80 dark:bg-muted/5 backdrop-blur-sm transition-all hover:shadow-xl ${
        plan.isMostPopular
          ? "border-primary/50 dark:border-primary/50 shadow-lg dark:shadow-primary/15 ring-1 ring-primary/10 dark:ring-primary/20"
          : "border-muted-foreground/20 hover:border-muted-foreground/30 dark:border-muted/30"
      }`}>
      {/* Most popular badge */}
      {plan.isMostPopular && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="primary" className="bg-primary text-primary-foreground flex items-center gap-1.5 px-4 py-1.5">
            <ZapIcon className="h-3.5 w-3.5 fill-current" />
            {t("pricing_most_popular")}
          </Badge>
        </div>
      )}

      <div className="w-full space-y-6">
        {/* Plan name and price */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-foreground dark:text-foreground">{plan.name}</h3>
          </div>

          <div className="space-y-2">
            <p className={`${plan.isMostPopular ? "text-primary" : "text-foreground"} text-4xl font-bold`}>
              ${plan.price}
              {plan.type !== "free_trial" && (
                <span className="text-base font-normal text-muted-foreground dark:text-muted-foreground/70">/mo</span>
              )}
            </p>
            {plan.type === "free_trial" ? (
              <p className="text-sm text-muted-foreground dark:text-muted-foreground/70">
                {plan.freeTrialDuration} {t("pricing_days_trial")}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground dark:text-muted-foreground/70">
                {t("pricing_billed_monthly")}
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            asChild
            size="lg"
            className="w-full py-6 text-base font-medium"
            variant={plan.isMostPopular ? "default" : "secondary"}>
            <Link href="/signup">
              <span className="flex items-center gap-2">
                {plan.type === "free_trial" ? <RocketIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5" />}
                {plan.type === "free_trial" ? t("pricing_start_trial") : t("pricing_get_started")}
              </span>
            </Link>
          </Button>
        </motion.div>

        {/* Features list */}
        <ul className="space-y-4 pt-4 border-t border-muted-foreground/10 dark:border-muted/20">
          {plan.features.map((feature, i) => (
            <motion.li key={i} className="flex items-start gap-3" whileHover={{ x: 3 }}>
              {feature.comingSoon ? (
                <div className="flex-shrink-0 p-1 rounded-full bg-amber-100/50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400">
                  <RocketIcon className="w-4 h-4" />
                </div>
              ) : (
                <div
                  className={`flex-shrink-0 p-1 rounded-full ${
                    plan.isMostPopular ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                  }`}>
                  <CheckIcon className="w-4 h-4" />
                </div>
              )}
              <span
                className={`text-sm ${
                  feature.comingSoon
                    ? "text-muted-foreground dark:text-muted-foreground/70"
                    : "text-foreground dark:text-foreground/90"
                }`}>
                {feature.description}
                {feature.comingSoon && (
                  <span className="ml-2 text-xs bg-muted dark:bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
                    {t("pricing_coming_soon")}
                  </span>
                )}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
