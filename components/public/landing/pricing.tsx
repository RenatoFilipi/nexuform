"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IPlan } from "@/utils/interfaces";
import { CheckIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Pricing = ({ plans }: { plans: IPlan[] }) => {
  const t = useTranslations("landing");

  return (
    <section
      id="pricing"
      className="py-12 sm:py-24 lg:py-32 bg-background dark:bg-gradient-to-b dark:from-background dark:to-muted/10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="text-primary border-primary/30 bg-primary/10 dark:bg-primary/20 dark:border-primary/50 px-3 py-1.5 text-sm font-medium uppercase">
            {t("nav_pricing")}
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight">{t("pricing_headline")}</h2>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground/80">{t("pricing_subheadline")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full mt-8">
          {plans.map((plan) => (
            <CardTemplate key={plan.type} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CardTemplate = ({ plan }: { plan: IPlan }) => {
  const t = useTranslations("landing");
  return (
    <div
      className={`relative flex flex-col items-start p-8 rounded-xl border bg-background dark:bg-muted/5 transition-all hover:shadow-lg ${
        plan.isMostPopular
          ? "border-primary/50 dark:border-primary/50 shadow-lg dark:shadow-primary/10 ring-1 ring-primary/10 dark:ring-primary/20"
          : "border-muted-foreground/20 hover:border-muted-foreground/30 dark:border-muted/30"
      }`}>
      {plan.isMostPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground shadow-md dark:shadow-primary/20">
            {t("pricing_most_popular")}
          </Badge>
        </div>
      )}

      <div className="w-full space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-foreground dark:text-foreground">{plan.name}</h3>
        </div>

        <div className="space-y-1">
          <p className={`${plan.isMostPopular ? "text-primary" : "text-foreground"} text-3xl font-bold`}>
            ${plan.price}
            {plan.type !== "free_trial" && (
              <span className="text-sm font-normal text-muted-foreground dark:text-muted-foreground/70">/mo</span>
            )}
          </p>
          {plan.type === "free_trial" ? (
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/70">
              {plan.freeTrialDuration} {t("pricing_days_trial")}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/70">{t("pricing_billed_monthly")}</p>
          )}
        </div>

        <Button asChild className="w-full" size="lg" variant={plan.isMostPopular ? "default" : "outline"}>
          <Link href={"/signup"}>
            {plan.type === "free_trial" ? t("pricing_start_trial") : t("pricing_get_started")}
          </Link>
        </Button>

        <ul className="space-y-3 pt-4">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              {feature.comingSoon ? (
                <RocketIcon className="flex-shrink-0 text-amber-500 dark:text-amber-400 w-4 h-4 mt-0.5" />
              ) : (
                <CheckIcon
                  className={`flex-shrink-0 ${plan.isMostPopular ? "text-primary" : "text-foreground"} w-4 h-4 mt-0.5`}
                />
              )}
              <span
                className={`text-sm ${
                  feature.comingSoon
                    ? "text-muted-foreground dark:text-muted-foreground/70"
                    : "text-foreground dark:text-foreground/90"
                }`}>
                {feature.description}
                {feature.comingSoon && (
                  <span className="ml-1.5 text-xs bg-muted dark:bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">
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
