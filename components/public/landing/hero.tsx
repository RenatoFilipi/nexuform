"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CreditCardIcon, RocketIcon } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-14 h-screen w-full px-8 sm:px-0">
      <BgDesign />
      <div className="flex justify-center items-center flex-col gap-8 w-full z-10 relative">
        <CtaBadge />
        <div className="flex flex-col justify-center items-center w-full text-center gap-6">
          <h1 className="font-bold text-2xl sm:text-6xl max-w-[70rem]">
            Capture Smarter Insights with <span className="text-primary">Powerful Forms.</span>
          </h1>
          <p className="max-w-xl sm:text-lg font-normal text-foreground/80">
            Turn raw feedback into valuable insights and make data-driven decisions effortlessly.
          </p>
        </div>
        <CtaActions />
      </div>
    </div>
  );
};
const BgDesign = () => {
  return <div className="absolute top-0 left-0 w-full h-full z-0"></div>;
};
const CtaBadge = () => {
  return (
    <div className="absolute -top-14 flex justify-center items-center bg-primary/5 py-1 px-3 rounded z-10">
      <span className="text-primary uppercase text-xs font-medium flex justify-center items-center gap-2">
        <RocketIcon className="w-4 h-4" />
        Build in Minutes
      </span>
    </div>
  );
};
const CtaActions = () => {
  return (
    <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full z-10">
      <Button asChild variant={"secondary"} className="w-full sm:w-fit">
        <Link href={"/signup"}>
          Get started for free <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Link>
      </Button>
      <div className="flex justify-center items-center gap-2 text-sm text-foreground/80">
        <CreditCardIcon className="w-4 h-4" />
        <span>No credit card required</span>
      </div>
    </div>
  );
};

export default Hero;
