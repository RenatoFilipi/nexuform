"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="pb-52 pt-20 w-full relative px-8 sm:px-0">
      <div className="px-4 mx-auto max-w-7xl text-center flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mb-5">
          <Brand type="logo" className="w-14 h-14 fill-foreground" />
        </div>
        <h2 className="text-base text-primary font-medium">Ready to improve your business?</h2>
        <p className="mt-2 text-2xl sm:text-4xl font-bold">Start your free trial today.</p>
        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row w-full">
          <Button asChild variant={"default"} className="w-full sm:w-fit">
            <Link href={"/signup"}>
              Get started for free <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
