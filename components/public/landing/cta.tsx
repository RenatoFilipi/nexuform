"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="pb-52 pt-20 w-full relative">
      <div className="px-4 mx-auto max-w-7xl text-center flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mb-5">
          <Brand type="logo" className="w-14 h-14 fill-foreground" />
        </div>
        <h2 className="text-base text-primary font-semibold">
          Ready to improve your business?
        </h2>
        <p className="mt-2 text-5xl font-bold">Start your free trial today.</p>
        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
          <Button asChild variant={"secondary"}>
            <Link href={"/signup"}>
              Get Started for Free
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
