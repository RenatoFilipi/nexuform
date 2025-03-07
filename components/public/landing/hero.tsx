"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-14 h-screen w-full px-8 sm:px-0">
      <div className="absolute top-40 flex justify-center items-center bg-primary/5 py-1 px-3 rounded">
        <span className="text-primary uppercase text-xs font-medium">Build in Minutes</span>
      </div>
      <div className="flex justify-center items-center flex-col gap-8 w-full">
        <div className="flex flex-col justify-center items-center w-full text-center gap-6">
          <h1 className="font-bold text-2xl sm:text-6xl max-w-[70rem]">
            Capture Smarter Insights with <span className="text-primary">Powerful Forms.</span>
          </h1>
          <p className="max-w-xl sm:text-lg font-normal text-foreground/80">
            Turn raw feedback into valuable insights and make data-driven decisions effortlessly.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full">
          <Button asChild variant={"secondary"} className="w-full sm:w-fit">
            <Link href={"/signup"}>
              Get Started Free <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <div className="flex justify-center items-center gap-2 text-sm text-foreground/80">
            <CreditCardIcon className="w-4 h-4" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
