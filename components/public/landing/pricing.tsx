"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plans } from "@/utils/constants";
import { freeTrialPeriod } from "@/utils/envs";
import { IPlanLanding } from "@/utils/interfaces";
import { CheckIcon, RocketIcon } from "lucide-react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-background px-8 sm:px-0 sm:min-h-screen">
      <div className="mx-auto sm:px-6 lg:px-8 gap-4 flex flex-col justify-center items-center">
        <div className="text-center flex flex-col justify-center items-center gap-4">
          <Badge uppercase variant={"primary"}>
            pricing
          </Badge>
          <h2 className="text-2xl font-bold leading-tight sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="text-base text-foreground/70">
            Choose the plan that fits your growth and scale at your own pace—upgrade whenever you&apos;re ready.
          </p>
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

const CardTemplate = ({ plan }: { plan: IPlanLanding }) => {
  return (
    <div
      className={`relative flex flex-col items-center sm:w-[360px] w-full p-6 bg-background border rounded ${
        plan.highlighted ? "border-primary border-2" : "border-foreground/20"
      }`}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          {plan.highlighted && (
            <Badge variant="purple" uppercase>
              Most Popular
            </Badge>
          )}
        </div>
        <div className="flex flex-col">
          <p className={`${plan.highlighted ? "text-primary" : "text-foreground"} mt-3 text-3xl font-extrabold`}>
            ${plan.price}
          </p>
          {plan.type === "free_trial" ? (
            <p className="text-sm text-foreground/80">{freeTrialPeriod} days trial</p>
          ) : (
            <p className="text-sm text-foreground/80">per month</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <Button className="w-full mt-6" size="lg" variant={plan.highlighted ? "default" : "secondary"}>
          {plan.type === "free_trial" ? "Start Free Trial" : "Get Started"}
        </Button>
      </div>
      <div className="flex flex-1 justify-start items-start w-full">
        <ul className="mt-4 space-y-3 text-left w-full">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm justify-start gap-3">
              {feature.includes("Soon") ? (
                <RocketIcon className="text-primary w-4 h-4" />
              ) : (
                <CheckIcon className={`${plan.highlighted ? "text-primary" : "text-primary"} w-4 h-4`} />
              )}
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
