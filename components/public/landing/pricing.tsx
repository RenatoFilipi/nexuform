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
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="pricing" className="relative py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl space-y-4">
          <Badge
            variant={"primary"}
            className="text-primary border-primary/30 dark:border-primary/50 px-3 py-1 text-xs">
            {t("nav_pricing")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("pricing_headline")}</h2>
          <p className="text-muted-foreground/80 leading-relaxed">{t("pricing_subheadline")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 w-full">
          {plans.map((plan) => (
            <motion.div key={plan.type} variants={itemVariants} whileHover={{ y: -3 }} className="h-full">
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
      className={`relative flex flex-col h-full p-6 rounded-xl border bg-background/80 dark:bg-muted/5 transition-all ${
        plan.isMostPopular
          ? "border-primary/40 dark:border-primary/40 shadow-sm ring-1 ring-primary/10"
          : "border-muted-foreground/15 hover:border-muted-foreground/25"
      }`}>
      {plan.isMostPopular && (
        <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2">
          <Badge
            variant="primary"
            className="bg-primary text-primary-foreground flex items-center gap-1 px-3 py-1 text-xs">
            <ZapIcon className="h-3 w-3 fill-current" />
            {t("pricing_most_popular")}
          </Badge>
        </div>
      )}

      <div className="w-full space-y-5">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
          <div className="space-y-1">
            <p className={`${plan.isMostPopular ? "text-primary" : "text-foreground"} text-2xl font-bold`}>
              ${plan.price}
              {plan.type !== "free_trial" && <span className="text-sm font-normal text-muted-foreground">/m</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              {plan.type === "free_trial"
                ? `${plan.freeTrialDuration} ${t("pricing_days_trial")}`
                : t("pricing_billed_monthly")}
            </p>
          </div>
        </div>

        <Button asChild size="sm" className="w-full" variant={plan.isMostPopular ? "default" : "outline"}>
          <Link href="/signup">
            <span className="flex items-center gap-2">
              {plan.type === "free_trial" ? (
                <RocketIcon className="h-3.5 w-3.5" />
              ) : (
                <CheckIcon className="h-3.5 w-3.5" />
              )}
              {plan.type === "free_trial" ? t("pricing_start_trial") : t("pricing_get_started")}
            </span>
          </Link>
        </Button>

        <ul className="space-y-3 pt-4 border-t border-muted-foreground/10">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              {feature.comingSoon ? (
                <div className="flex-shrink-0 p-1 rounded-full bg-amber-100/50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400">
                  <RocketIcon className="w-3 h-3" />
                </div>
              ) : (
                <div
                  className={`flex-shrink-0 p-0.5 rounded ${
                    plan.isMostPopular ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                  }`}>
                  <CheckIcon className="w-2.5 h-2.5" />
                </div>
              )}
              <span className={`text-xs ${feature.comingSoon ? "text-muted-foreground" : "text-foreground"}`}>
                {feature.description}
                {feature.comingSoon && (
                  <span className="ml-1.5 text-[0.65rem] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                    {t("pricing_coming_soon")}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
