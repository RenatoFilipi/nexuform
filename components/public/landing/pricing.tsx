"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TPlan } from "@/utils/types";
import { useTranslations } from "next-intl";

const Pricing = () => {
  const t = useTranslations("landing");

  const renderPrice = (price: number) => (
    <span>
      ${price.toFixed(0)}{" "}
      <span className="text-sm text-foreground/80 font-normal">/month</span>
    </span>
  );

  const renderOnlyPrice = (price: number) => <span>${price.toFixed(0)}</span>;

  const plans: TPlan[] = [
    {
      name: t("pricing.plans.free_trial.name"),
      price: 0,
      features: [
        t("pricing.plans.free_trial.features.0"),
        t("pricing.plans.free_trial.features.1"),
        t("pricing.plans.free_trial.features.2"),
        t("pricing.plans.free_trial.features.3"),
      ],
      highlighted: false,
      type: "free_trial",
    },
    {
      name: t("pricing.plans.basic.name"),
      price: 5,
      features: [
        t("pricing.plans.basic.features.0"),
        t("pricing.plans.basic.features.1"),
        t("pricing.plans.basic.features.2"),
        t("pricing.plans.basic.features.3"),
        t("pricing.plans.basic.features.4"),
      ],
      highlighted: false,
      type: "basic",
    },
    {
      name: t("pricing.plans.pro.name"),
      price: 15,
      features: [
        t("pricing.plans.pro.features.0"),
        t("pricing.plans.pro.features.1"),
        t("pricing.plans.pro.features.2"),
        t("pricing.plans.pro.features.3"),
        t("pricing.plans.pro.features.4"),
        t("pricing.plans.pro.features.5"),
        t("pricing.plans.pro.features.6"),
      ],
      highlighted: true,
      type: "pro",
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            {t("pricing.title")}
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-2 text-foreground/60">
            {t("pricing.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-8 transition-shadow bg-background border rounded-xl shadow-md hover:shadow-xl ${
                plan.highlighted
                  ? "border-primary border-2 scale-105"
                  : "border-foreground/20"
              }`}
              aria-label={`Plan: ${plan.name}`}>
              <div className="flex items-center space-x-3">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {plan.highlighted && (
                  <Badge variant="green" className="py-1 px-2 text-sm">
                    {t("pricing.badge.most_popular")}
                  </Badge>
                )}
              </div>
              {plan.type === "free_trial" ? (
                <p className="mt-4 text-3xl font-extrabold text-primary">
                  {renderOnlyPrice(plan.price)}
                </p>
              ) : (
                <p className="mt-4 text-3xl font-extrabold text-primary">
                  {renderPrice(plan.price)}
                </p>
              )}
              <div className="w-full mt-4">
                <Button
                  className="w-full"
                  size="sm"
                  variant={plan.highlighted ? "default" : "secondary"}>
                  {plan.type === "free_trial"
                    ? "Start Free Trial"
                    : "Subscribe"}
                </Button>
              </div>
              <div className="w-full mt-6 border-t border-foreground/20"></div>
              <ul className="mt-6 space-y-3 text-left w-full">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-start text-sm">
                    <svg
                      className="flex-shrink-0 mr-3 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true">
                      <path
                        d="M9 11l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
