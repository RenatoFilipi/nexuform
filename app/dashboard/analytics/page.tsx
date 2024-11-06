"use client";

import { Card } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div>
          <Card className="">analytics card</Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
