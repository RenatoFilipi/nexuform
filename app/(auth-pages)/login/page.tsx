import Brand from "@/components/core/brand";
import LoginForm from "@/components/public/auth/login-form";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 sm:flex hidden w-full relative bg-gradient-to-b from-black to-primary">
        <Link href={"/"}>
          <Brand
            type="logo_text"
            className="h-8 fill-white absolute top-6 left-6"
          />
        </Link>
      </div>
      <div className="flex-1 flex justify-center items-center w-full relative">
        <Link href={"/"} className="fixed top-6 flex sm:hidden">
          <Brand type="logo" className="h-8 fill-foreground" />
        </Link>
        <div className="absolute top-3 left-3 hidden gap-2 justify-between items-center">
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href={"/"}>
              <ChevronLeftIcon className="w-4 h-4 mr-" />
              Go back
            </Link>
          </Button>
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-col items-center justify-center w-full sm:max-w-96 gap-6 sm:p-0 px-12">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
