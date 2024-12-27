"use client";

import { Button } from "@/components/ui/button";

const Pricing = () => {
  const plans = [
    {
      name: "Free Trial",
      priceMonthly: 0,
      trialPeriod: "14 days",
      features: [
        "Access to all Basic plan features",
        "Up to 10 forms during the trial",
        "Basic analytics: form views and submissions",
        "Support via email (48h SLA)",
      ],
    },
    {
      name: "Basic",
      priceMonthly: 8,
      features: [
        "Up to 10 forms",
        "all customizable blocks",
        "Basic analytics: form views, submissions, and responses",
        "Share via link or QR Code",
        "Support via email (48h SLA)",
      ],
    },
    {
      name: "Pro",
      priceMonthly: 15,
      features: [
        "Unlimited forms",
        "all customizable blocks",
        "Advanced analytics: graphical insights and trends",
        "Integration with Google Sheets",
        "Enhanced customization: advanced themes and button styling",
        "Share via link or QR Code",
        "Support via email (24h SLA)",
      ],
      isFeatured: true,
    },
    {
      name: "Enterprise",
      priceMonthly: "Upon request",
      features: [
        "All Pro plan features",
        "Advanced analytics",
        "Dedicated account manager",
        "Priority support (6h SLA)",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-8 text-foreground/60">
            Choose the plan that best suits your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-6 transition-shadow bg-white border rounded-lg shadow-lg ${
                plan.isFeatured ? "border-2 border-primary" : "border-gray-200"
              }`}>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                {plan.isFeatured && (
                  <span className="bg-primary text-white text-xs py-1 px-2 rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-lg font-semibold">
                {plan.priceMonthly === "Upon request" ? (
                  plan.priceMonthly
                ) : (
                  <span>$ {(plan.priceMonthly as number).toFixed(2)}/m</span>
                )}
              </p>
              <Button className="w-full">Get Started</Button>
              <ul className="mt-6 text-left space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 text-primary">
                      <path
                        d="M9 11l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
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
