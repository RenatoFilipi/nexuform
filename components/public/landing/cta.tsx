"use client";

import GridPattern from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="w-full py-40 flex justify-center sm:justify-start items-center px-4 sm:px-20 sm:bg-gradient-to-r relative from-primary to-foreground bg-primary">
      <GridPattern width={15} height={15} x={-1} y={-1} strokeDasharray={"4 2"} className={cn("")} maxOpacity={0.2} />
      <div className="w-full flex flex-col gap-0 z-10 justify-center">
        <h2 className="text-4xl text-center sm:text-start text-background font-medium">
          Ready to improve your business?
        </h2>
        <p className="text-lg text-center sm:text-start text-background/80">Start your free trial today.</p>
        <div className="mt-8">
          <Button asChild variant={"secondary"} className="w-full sm:w-fit">
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
