import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IPlan } from "@/utils/interfaces";
import { getPlans } from "@/utils/plans";
import { CheckIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

const Pricing = async () => {
  const t = await getTranslations("landing");
  const locale = await getLocale();
  const plans = await getPlans(locale);

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background px-8 sm:px-0 sm:min-h-dvh">
      <div className="mx-auto sm:px-6 lg:px-8 gap-4 flex flex-col justify-center items-center">
        <div className="text-center flex flex-col justify-center items-center gap-4">
          <Badge uppercase variant={"primary"}>
            {t("nav_pricing")}
          </Badge>
          <h2 className="text-2xl font-bold leading-tight sm:text-4xl">{t("pricing_headline")}</h2>
          <p className="text-base text-foreground/70">{t("pricing_subheadline")}</p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
      className={`relative flex flex-col items-center sm:w-[360px] w-full p-6 bg-background border rounded ${
        plan.isMostPopular ? "border-primary border-2" : "border-foreground/20"
      }`}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          {plan.isMostPopular && <Badge variant="green">{t("pricing_most_popular")}</Badge>}
        </div>
        <div className="flex flex-col">
          <p className={`${plan.isMostPopular ? "text-primary" : "text-foreground"} mt-3 text-3xl font-extrabold`}>
            ${plan.price}
          </p>
          {plan.type === "free_trial" ? (
            <p className="text-sm text-foreground/80">
              {plan.freeTrialDuration} {t("pricing_days_trial")}
            </p>
          ) : (
            <p className="text-sm text-foreground/80">{t("pricing_per_month")}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <Button asChild className="w-full mt-6" size="lg" variant={plan.isMostPopular ? "default" : "secondary"}>
          <Link href={"/signup"}>{plan.type === "free_trial" ? "Start Free Trial" : "Get Started"}</Link>
        </Button>
      </div>
      <div className="flex flex-1 justify-start items-start w-full">
        <ul className="mt-4 space-y-3 text-left w-full">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm justify-start gap-3">
              {feature.comingSoon ? (
                <RocketIcon className="text-amber-500 w-4 h-4" />
              ) : (
                <CheckIcon className={`${plan.isMostPopular ? "text-primary" : "text-foreground"} w-4 h-4`} />
              )}
              <span className={`${feature.comingSoon ? "text-foreground/80" : "font-medium"} text-foreground`}>
                {feature.description} {feature.comingSoon && "(Soon)"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
