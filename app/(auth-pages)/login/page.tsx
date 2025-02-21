import Brand from "@/components/core/brand";
import { Particles } from "@/components/magicui/particles";
import LoginForm from "@/components/public/auth/login-form";
import Link from "next/link";
import { Suspense } from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 sm:flex hidden w-full relative bg-gradient-to-b from-[#181C1F] to-primary">
        <Link href={"/"}>
          <Brand type="logo_text" className="h-8 fill-white absolute top-6 left-6" />
        </Link>
        <Particles className="absolute inset-0 z-0" quantity={100} ease={20} color="#ffffff" refresh />
      </div>
      <div className="flex-1 flex justify-center items-center w-full relative">
        <Link href={"/"} className="fixed top-6 flex sm:hidden">
          <Brand type="logo" className="h-8 fill-foreground" />
        </Link>
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
