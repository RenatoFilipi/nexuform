"use client";

import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <div className="flex flex-col gap-14">
      <div className="flex justify-center items-center flex-col gap-6 w-full">
        <div className="flex flex-col justify-center items-center w-full text-center gap-8">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}>
            <AnimatedShinyText className="text-xs inline-flex items-center justify-center px-4 py-1 transition ease-out text-foreground">
              <span>✨ V1 Launching Soon!</span>
              <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
          <h1 className="font-bold text-2xl sm:text-5xl max-w-[43.5rem]">
            {t("hero.headline_pt1")}{" "}
            <span className="text-primary">{t("hero.headline_pt2")}</span>
          </h1>
          <p className="max-w-xl text-base font-normal text-foreground/80">
            Drive smarter decisions with actionable insights. Elevate your
            business processes by transforming feedback into meaningful data.
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 flex-col sm:flex-row w-full">
          <Button asChild variant={"secondary"} className="w-full sm:w-fit">
            <Link href={"/signup"}>
              Get Started for Free
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
          src={`/hero.png`}
          width={1000}
          height={500}
          priority
        />
      </ShineBorder>
    </div>
  );
};

export default Hero;
