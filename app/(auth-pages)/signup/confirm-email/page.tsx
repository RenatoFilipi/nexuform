"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

const ConfirmEmail = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen relative">
      <div className="flex flex-col justify-center items-center sm:max-w-96 sm:p-0 px-6 gap-8">
        <div className="flex justify-center items-center p-2 rounded-xl bg-success/20">
          <CheckIcon className="w-12 h-12 text-success" />
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-center text-foreground/80 text-sm">
            Thank you for confirming your email address. Your account is now fully activated and you can access all
            features of our platform.
          </p>
          <Button variant={"secondary"} size={"sm"} asChild className="w-full">
            <Link href={"/"}>Continue to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
