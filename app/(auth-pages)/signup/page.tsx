import AuthPanel from "@/components/public/auth/auth-panel";
import SignupForm from "@/components/public/auth/signup-form";
import { Metadata } from "next";

const Signup = () => {
  return (
    <div className="min-h-dvh flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <div className="flex flex-col items-center justify-center w-full sm:max-w-[450px] gap-6 sm:p-0 px-12">
          <SignupForm />
        </div>
      </div>
      <AuthPanel />
    </div>
  );
};

export default Signup;

export const metadata: Metadata = {
  title: "Signup",
};
