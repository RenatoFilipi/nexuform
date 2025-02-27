"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

const PaymentConfirmation = () => {
  return (
    <div className="flex justify-center items-center h-screen relative border-t border-t-foreground/5 dark:bg-foreground/5 bg-[#F8F8F8]">
      <Card className="flex flex-col justify-center items-center py-6 gap-8 relative px-10 mx-4">
        <Brand type="logo" className="h-10 fill-foreground absolute -top-16 hidden" />
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center bg-success/10 p-3 rounded">
            <ShoppingBagIcon className="w-8 h-8 text-success" />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-xl font-semibold">Subscription Active</h1>
            <span className="text-sm text-foreground/60">
              Thank you for subscribing. Your subscription is now active.
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <Button asChild variant={"secondary"} size={"sm"} className="w-full">
            <Link href={"/dashboard/forms"}>Go to Dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
