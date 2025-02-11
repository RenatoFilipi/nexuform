"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plans } from "@/utils/constants";
import { IPlanDesign } from "@/utils/interfaces";

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
            Simple & Flexible Pricing
          </h2>
          <p className="mt-4 text-base leading-7 sm:mt-2 text-foreground/60">
            Pick the perfect plan to match your growth—upgrade anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-10 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <CardTemplate key={plan.type} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CardTemplate = ({ plan }: { plan: IPlanDesign }) => {
  return (
    <div
      className={`relative flex flex-col items-center sm:w-[340px] w-full p-8 bg-background border rounded-lg shadow-lg transition-transform hover:scale-105 hover:shadow-xl ${
        plan.highlighted ? "border-primary border-2" : "border-foreground/20"
      }`}>
      <div className="flex flex-col w-full">
        <div className="flex justify-start items-center gap-2">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          {plan.highlighted && (
            <Badge variant="green" className="">
              Most Popular
            </Badge>
          )}
        </div>
        <p className="mt-3 text-4xl font-extrabold text-primary">
          ${plan.price}
        </p>
        <p className="text-sm text-foreground/60">per month</p>
      </div>
      <div className="w-full">
        <Button
          className="w-full mt-6"
          size="lg"
          variant={plan.highlighted ? "default" : "secondary"}>
          {plan.type === "free_trial" ? "Start Free Trial" : "Get Started"}
        </Button>
      </div>
      <div className="flex flex-1 justify-start items-start w-full">
        <ul className="mt-4 space-y-3 text-left w-full">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm">
              <svg
                className="flex-shrink-0 mr-2 text-primary"
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
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
