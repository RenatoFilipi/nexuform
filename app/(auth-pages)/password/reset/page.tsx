import ResetPasswordForm from "@/components/public/auth/reset-password-form";
import { Metadata } from "next";

const Reset = () => {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      <ResetPasswordForm />
    </div>
  );
};

export default Reset;

export const metadata: Metadata = {
  title: "Password reset",
};
