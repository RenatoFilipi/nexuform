"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import DotPattern from "@/components/magicui/dot-pattern";
import Particles from "@/components/magicui/particles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex fixed top-0 w-full justify-around h-14 bg-background/80 z-10 backdrop-blur-sm">
        <Link href={"/"} className="flex justify-center items-center">
          <Image alt="brand" src={"/brand.svg"} width={180} height={0} />
        </Link>
        <div className="flex justify-center items-center gap-4">
          <Button variant={"outline"} size={"sm"}>
            Login
          </Button>
          <Button size={"sm"}>Get Started</Button>
        </div>
      </div>
      <div className="mt-52 mb-36 relative flex flex-col justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-6 w-full">
          <div className="flex flex-col justify-center items-center w-full text-center gap-6">
            <h1 className="font-bold text-6xl max-w-[43.5rem]">
              Streamline Feedback <span>With Intuitive Forms</span>
            </h1>
            <p className="max-w-xl text-base font-normal">
              Transform Your Business Landscape through Strategic Decision-Making with Data Insights.
            </p>
          </div>
          <div>
            <Button>
              Start Free Trial
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="mt-20">
          <div className="relative rounded-lg border p-2">
            <BorderBeam borderWidth={3} />
            <Image alt="hero preview feature" src={"/dash.webp"} width={1200} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
