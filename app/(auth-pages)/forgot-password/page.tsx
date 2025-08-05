import ResetPasswordForm from "@/components/public/auth/reset-password-form";
import { Metadata } from "next";

const ForgotPassword = () => {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      <ResetPasswordForm />
    </div>
  );
};

export default ForgotPassword;

export const metadata: Metadata = {
  title: "Forgot password",
};
