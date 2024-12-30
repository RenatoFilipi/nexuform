"use client";

import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-40 bg-gradient-to-b from-[#181C1F] to-primary text-white w-full">
      <div className="px-4 mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to Improve Your Products and Services?
        </h2>
        <p className="mt-4 text-lg">
          Collect valuable feedback and insights with custom forms to enhance
          your offerings.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
          <Button size={"sm"}>See How It Works</Button>
          <Button size={"sm"} variant={"secondary"}>
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
