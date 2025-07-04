import SignupForm from "@/components/public/auth/signup-form";
import { Metadata } from "next";

const Signup = () => {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      <SignupForm />
    </div>
  );
};

export default Signup;

export const metadata: Metadata = {
  title: "Signup",
};
