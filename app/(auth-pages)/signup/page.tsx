import SignupForm from "@/components/public/auth/signup-form";
import Nav from "@/components/public/core/nav";
import { default as Brand } from "@/components/shared/core/brand";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const Signup = () => {
  return (
    <div className="min-h-dvh flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <div className="fixed top-0 flex sm:hidden w-full justify-between items-center px-3 h-14">
          <Link href={"/"} className="flex justify-center items-center">
            <Brand type="logo" className="h-7 fill-foreground" />
          </Link>
          <Nav>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="w-6 h-6" />
            </Button>
          </Nav>
        </div>
        <div className="flex flex-col items-center justify-center w-full sm:max-w-[450px] gap-6 sm:p-0 px-12">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;

export const metadata: Metadata = {
  title: "Signup",
};
