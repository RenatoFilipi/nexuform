"use client";

import Brand from "@/components/core/brand";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ConfirmEmail = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen relative">
      <Link href={"/"} className="fixed top-6 flex">
        <Brand type="logo" className="h-8 fill-foreground" />
      </Link>
      <div className="flex flex-col justify-center items-center sm:max-w-96 sm:p-0 px-6">
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-center text-foreground/80">
            Your email has been successfully confirmed. You can now access all
            features of your account.
          </p>
          <Button variant={"secondary"} size={"sm"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
