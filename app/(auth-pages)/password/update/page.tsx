import UpdatePasswordForm from "@/components/public/auth/update-password-form";
import { Metadata } from "next";

const Update = () => {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      <UpdatePasswordForm />
    </div>
  );
};

export default Update;

export const metadata: Metadata = {
  title: "Password update",
};
