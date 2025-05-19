import AuthPanel from "@/components/public/auth/auth-panel";
import ResetPasswordForm from "@/components/public/auth/reset-password-form";
import { Metadata } from "next";

const Reset = () => {
  return (
    <div className="min-h-dvh flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-col items-center justify-center w-full sm:max-w-[450px] gap-6 sm:p-0 px-12">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
      <AuthPanel />
    </div>
  );
};

export default Reset;

export const metadata: Metadata = {
  title: "Password reset",
};
