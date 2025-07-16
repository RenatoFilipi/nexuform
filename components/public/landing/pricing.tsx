"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/functions";
import { IPlan } from "@/utils/pricing";
import { motion } from "framer-motion";
import { CheckIcon, ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Pricing = ({ plans }: { plans: IPlan[] }) => {
  const t = useTranslations("pricing");
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
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl space-y-4">
          <Badge
            variant={"primary"}
            className="text-primary border-primary/30 dark:border-primary/50 px-3 py-1 text-xs">
            {t("pricing")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("headline")}</h2>
          <p className="text-muted-foreground/80 leading-relaxed">{t("subheadline")}</p>
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
  const t = useTranslations("pricing");

  return (
    <Card
      key={plan.id}
      className={`relative flex flex-col h-full p-5 rounded-xl ${
        plan.isMostPopular
          ? "border-primary ring-1 ring-primary/10 bg-primary/10"
          : "border-muted-foreground/15 hover:border-muted-foreground/25"
      }`}>
      {plan.isMostPopular && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 transform translate-x-2 -translate-y-2 rounded-bl-lg">
          {t("most_popular")}
        </div>
      )}
      <div className="flex flex-col justify-between h-full items-center w-full gap-6">
        <div className="p-3 flex flex-col w-full">
          <div className="flex justify-start items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">{plan.description}</p>
          <div className="mt-6">
            <div className="flex items-center">
              <span className="text-4xl">{formatCurrency("USD", plan.price.amount, "compact")}</span>
              {!plan.freeTrialDuration && (
                <span className="ml-2 text-sm font-medium text-muted-foreground">/{t("month")}</span>
              )}
            </div>
            {plan.freeTrialDuration && (
              <p className="mt-1 text-sm text-green-600">
                {plan.freeTrialDuration}-{t("day_freetrial")}
              </p>
            )}
          </div>
          <div className="mt-8">
            <h4 className="text-sm font-semibold">{t("recommended_for")}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{plan.recommendedFor}</p>
          </div>
          <div className="mt-8">
            <h4 className="text-sm font-semibold">{t("whats_included")}</h4>
            <ul className="mt-4 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.comingSoon ? (
                    <div className="flex">
                      <ClockIcon className="w-4 h-4 text-muted-foreground/70" />
                    </div>
                  ) : (
                    <div className={`flex`}>
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                  <span
                    className={`ml-3 text-xs ${
                      feature.comingSoon ? "text-muted-foreground/70" : "text-muted-foreground"
                    }`}>
                    {feature.description}
                    {feature.comingSoon && (
                      <span className="ml-1 text-xs text-muted-foreground/70">({t("coming_soon")})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full">
          <Button className="w-full" variant={plan.isMostPopular ? "secondary" : "outline"} asChild>
            <Link href="/signup">{plan.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Pricing;
