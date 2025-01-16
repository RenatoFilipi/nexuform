import { default as Brand } from "@/components/core/brand";
import SignupForm from "@/components/public/auth/signup-form";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const Signup = () => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 sm:flex hidden w-full relative bg-gradient-to-b from-black to-primary">
        <Brand
          type="logo_text"
          className="h-8 fill-white absolute top-6 left-6"
        />
      </div>
      <div className="flex-1 flex justify-center items-center w-full relative">
        <Link href={"/"} className="fixed top-6 flex sm:hidden">
          <Brand type="logo" className="h-8 fill-foreground" />
        </Link>
        <div className="absolute top-3 left-3 hidden sm:flex gap-2 justify-between items-center">
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href={"/"}>
              <ChevronLeftIcon className="w-4 h-4 mr-" />
              Go back
            </Link>
          </Button>
        </div>
        <div className="w-full flex justify-center items-center sm:max-w-96 sm:p-0 px-12">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Signup;
