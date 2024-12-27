"use client";

import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-40 bg-gradient-to-b from-[#181C1F] to-primary text-white w-full">
      <div className="px-4 mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-4 text-lg">
          Unlock all features and grow your business today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size={"sm"}>Learn More</Button>
          <Button size={"sm"} variant={"secondary"}>
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
