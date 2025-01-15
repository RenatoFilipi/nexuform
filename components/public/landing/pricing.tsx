"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free Trial",
    priceMonthly: 0,
    trialPeriod: "14 days",
    label: "Start Free Trial",
    available: true,
    features: [
      "Full access to all Premium plan features for 14 days",
      "Create up to 50 forms during the trial period",
      "5,000 submissions included during the trial",
      "Advanced analytics with charts and trend insights",
      "Seamless integration with Google Sheets",
      "Export submission data as CSV files",
      "Remove Nebulaform branding from your forms",
      "Share forms effortlessly via link or QR code",
      "Priority email support with a 24-hour response time (SLA)",
    ],
  },
  {
    name: "Basic",
    priceMonthly: 8,
    label: "Get Started",
    available: true,
    features: [
      "Create up to 10 forms",
      "1,000 submissions per month included",
      "Access all customizable form blocks",
      "Basic analytics: track views, submissions, and responses",
      "Share forms easily via link or QR code",
      "Email support with a 48-hour response time (SLA)",
    ],
  },
  {
    name: "Premium",
    priceMonthly: 18,
    label: "Get Started",
    available: true,
    features: [
      "Create up to 50 forms",
      "5,000 submissions per month included",
      "Access all customizable form blocks",
      "Advanced analytics with charts and trend insights",
      "Seamless integration with Google Sheets",
      "Export submission data as CSV files",
      "Remove Nebulaform branding from your forms",
      "Share forms effortlessly via link or QR code",
      "Priority email support with a 24-hour response time (SLA)",
    ],
    isFeatured: true,
  },
  {
    name: "Enterprise",
    priceMonthly: "Let's Talk",
    label: "Contact Sales",
    available: false,
    features: [
      "All Premium plan features included",
      "Advanced analytics for in-depth insights",
      "Priority support with a 6-hour response time (SLA)",
    ],
  },
];

const Pricing = () => {
  const renderPrice = (price: string | number) =>
    typeof price === "string" ? (
      price
    ) : (
      <span>
        $ {price.toFixed(2)}{" "}
        <span className="text-sm text-foreground/80 font-normal">/month</span>
      </span>
    );

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-8 text-foreground/60">
            Choose the plan that best suits your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {plans
            .filter((plan) => plan.available)
            .map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-8 transition-shadow bg-background border rounded-xl shadow-md hover:shadow-xl ${
                  plan.isFeatured
                    ? "border-primary border-2 scale-105"
                    : "border-foreground/20"
                }`}
                aria-label={`Plan: ${plan.name}`}>
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.name === "Free Trial" && (
                    <Badge variant="green" className="py-1 px-2 text-sm">
                      Premium
                    </Badge>
                  )}
                  {plan.isFeatured && (
                    <Badge variant="green" className="py-1 px-2 text-sm">
                      Most Popular
                    </Badge>
                  )}
                </div>
                <p className="mt-4 text-3xl font-extrabold text-primary">
                  {renderPrice(plan.priceMonthly)}
                </p>
                <div className="w-full mt-4">
                  <Button
                    className="w-full"
                    size="sm"
                    variant={plan.isFeatured ? "default" : "secondary"}>
                    {plan.label}
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
