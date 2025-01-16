"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plan } from "@/utils/types";
import { useTranslations } from "next-intl";

const Pricing = () => {
  const t = useTranslations("landing");

  const renderPrice = (price: number) => (
    <span>
      ${price.toFixed(2)}{" "}
      <span className="text-sm text-foreground/80 font-normal">/month</span>
    </span>
  );

  const plans: plan[] = [
    {
      name: "Free Trial",
      price: 0,
      features: [
        "14 days of full access to Pro plan features",
        "100 submissions",
        "1 active form",
        "Email support",
      ],
      highlighted: false,
      type: "free_trial",
    },
    {
      name: "Basic",
      price: 9,
      features: [
        "Up to 5 active forms",
        "1,000 submissions per month",
        "Email notifications",
        "Google Sheets and Slack integrations",
      ],
      highlighted: false,
      type: "basic",
    },
    {
      name: "Pro",
      price: 29,
      features: [
        "Unlimited forms",
        "10,000 submissions per month",
        "Advanced integrations (Zapier, Webhooks)",
        "Full customization of form design and fields",
        "Custom reports and data export",
        "Priority support",
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
            Pricing Plans
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-2 text-foreground/60">
            Choose the plan that best suits your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
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
                {plan.type === "free_trial" && (
                  <Badge variant="green" className="py-1 px-2 text-sm">
                    Pro
                  </Badge>
                )}
                {plan.highlighted && (
                  <Badge variant="green" className="py-1 px-2 text-sm">
                    Most Popular
                  </Badge>
                )}
              </div>
              <p className="mt-4 text-3xl font-extrabold text-primary">
                {renderPrice(plan.price)}
              </p>
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
              <ul className="mt-6 space-y-3 text-left">
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
