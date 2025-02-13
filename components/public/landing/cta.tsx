"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="pb-52 pt-20 w-full relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-32 left-1/3 w-72 h-72 bg-violet-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-32 left-1/2 w-60 h-60 bg-fuchsia-400 rounded-full blur-3xl opacity-30"></div>
      </div>
      <div className="px-4 mx-auto max-w-7xl text-center flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mb-5">
          <Brand type="logo" className="w-14 h-14 fill-foreground" />
        </div>
        <h2 className="text-base text-primary font-semibold">Ready to improve your business?</h2>
        <p className="mt-2 text-5xl font-bold">Start your free trial today.</p>
        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
          <Button asChild variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
            <Link href={"/signup"}>Get started for free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
