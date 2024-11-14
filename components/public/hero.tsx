"use client";

import ShineBorder from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const { theme } = useTheme();

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-6 w-full">
        <div className="flex flex-col justify-center items-center w-full text-center gap-6">
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
          <Button variant={"outline"} className="w-full sm:w-fit">
            View Demo
          </Button>
        </div>
      </div>
      <div className="mb-20">
        <ShineBorder
          className="relative rounded-lg border"
          color={["#89FF4D", "#89FF4D", "#89FF4D"]}>
          <Image
            alt="hero preview feature"
            src={`${theme === "light" ? "/mail.webp" : "/mail-dark.webp"}`}
            width={1000}
            height={500}
          />
        </ShineBorder>
      </div>
    </>
  );
};

export default Hero;
