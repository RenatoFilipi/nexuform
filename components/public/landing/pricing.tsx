"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClockIcon, LightbulbIcon } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/functions";
import { IPlan } from "@/utils/pricing";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Pricing = ({ plans }: { plans: IPlan[] }) => {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center space-y-4">
          <h2 className="text-5xl font-extrabold text-foreground tracking-tight">{t("headline")}</h2>
          <p className="text-muted-foreground/80 text-lg">{t("subheadline")}</p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}>
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4, scale: 1.0 }}
              className="h-full">
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const PricingCard = ({ plan }: { plan: IPlan }) => {
  const t = useTranslations("pricing");

  return (
    <Card
      className={`relative flex flex-col h-full p-6 rounded-3xl backdrop-blur-lg border border-foreground/10 shadow-xl transition-all duration-300 hover:shadow-3xl ${
        plan.isMostPopular
          ? "ring-2 ring-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10"
          : "bg-card/80 hover:bg-card/90 hover:border-muted-foreground/25"
      }`}>
      {plan.isMostPopular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-lg shadow-md">
          {t("most_popular")}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-semibold text-foreground">
          {formatCurrency("USD", plan.price.amount, "compact")}
        </span>
        {!plan.freeTrialDuration && <span className="text-sm text-muted-foreground">/{t("month")}</span>}
      </div>
      {plan.freeTrialDuration && (
        <p className="mt-1 text-green-500 font-medium">
          {plan.freeTrialDuration} {t("day_freetrial")}
        </p>
      )}

      {/* Recommended for */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground flex justify-start items-center gap-1">
          {t("recommended_for")}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">{plan.recommendedFor}</p>
      </div>

      {/* Features */}
      <div className="mt-6 flex-1">
        <h4 className="text-sm font-semibold text-foreground">{t("whats_included")}</h4>
        <ul className="mt-4 space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              {feature.comingSoon ? (
                <ClockIcon className="w-4 h-4 text-muted-foreground/70 mt-1" />
              ) : (
                <CheckIcon className="w-4 h-4 text-green-500 mt-1" />
              )}
              <span className={`text-xs ${feature.comingSoon ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                {feature.description}{" "}
                {feature.comingSoon && <span className="text-muted-foreground/60">({t("coming_soon")})</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <Button
          className="w-full font-semibold text-sm hover:scale-105 transition-transform duration-200"
          variant={plan.isMostPopular ? "secondary" : "outline"}
          asChild>
          <Link href="/signup">{plan.ctaLabel}</Link>
        </Button>
      </div>
    </Card>
  );
};

export default Pricing;
