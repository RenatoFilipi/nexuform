"use client";

import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("landing");

  return (
    <div className="relative flex flex-col justify-center items-center gap-14 sm:pt-36 pt-20 w-full">
      {/* Background with blurred shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-56 left-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-25"></div>
      </div>
      <div className="flex justify-center items-center flex-col gap-10 w-full">
        <div className="flex flex-col justify-center items-center w-full text-center gap-6">
          <h1 className="font-bold text-2xl sm:text-5xl max-w-[43.5rem]">
            Elevate Feedback Collection with{" "}
            <span className="text-primary">Powerful Forms.</span>
          </h1>
          <p className="max-w-xl text-base font-normal text-foreground/60">
            Gain actionable insights and transform feedback into meaningful data
            to drive smarter business decisions.
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
        className="relative rounded-lg"
        color={["#7C3AED", "#7C3AED", "#7C3AED"]}>
        <Image
          className=""
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
