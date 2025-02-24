"use client";

import GridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-14 h-screen w-full px-8 sm:px-0">
      <GridPattern
        numSquares={100}
        maxOpacity={0.1}
        duration={2}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 -z-10"
        )}
      />
      <div className="flex justify-center items-center flex-col gap-8 w-full">
        <div className="flex flex-col justify-center items-center w-full text-center gap-6">
          <h1 className="font-semibold text-2xl sm:text-7xl max-w-[70rem]">
            Elevate Feedback Collection with <span className="text-primary">Powerful Forms.</span>
          </h1>
          <p className="max-w-xl text-base font-normal text-foreground/80">
            Gain actionable insights and transform feedback into meaningful data to drive smarter business decisions.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full">
          <Button asChild variant={"default"} className="w-full sm:w-fit">
            <Link href={"/signup"}>
              Get started for free <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant={"secondary"} className="w-full sm:w-fit">
            Watch Demo <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
