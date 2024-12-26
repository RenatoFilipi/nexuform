"use client";

import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex flex-col gap-14">
      <div className="flex justify-center items-center flex-col gap-6 w-full">
        <div className="flex flex-col justify-center items-center w-full text-center gap-6">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Introducing Magic UI</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
          <h1 className="font-bold text-2xl sm:text-5xl max-w-[43.5rem]">
            Streamline Feedback With{" "}
            <span className="text-primary">Intuitive Forms.</span>
          </h1>
          <p className="max-w-xl text-base font-normal text-foreground/80">
            Transform Your Business Landscape through Strategic Decision-Making
            with Data Insights.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full">
          <Button asChild variant={"secondary"} className="w-full sm:w-fit">
            <Link href={"/dashboard/forms"}>
              Start Free Trial
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
      <ShineBorder
        className="relative rounded-lg border"
        color={["#7C3AED", "#7C3AED", "#7C3AED"]}>
        <Image
          alt="hero preview feature"
          src={`/mail.webp`}
          width={1000}
          height={500}
          priority
        />
      </ShineBorder>
    </div>
  );
};

export default Hero;
