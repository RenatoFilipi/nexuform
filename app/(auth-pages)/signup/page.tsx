import SignupForm from "@/components/public/auth/signup-form";
import WaitlistForm from "@/components/public/auth/waitlist-form";
import { Metadata } from "next";

const Signup = () => {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      {/* <SignupForm /> */}
      <WaitlistForm />
    </div>
  );
};

export default Signup;

export const metadata: Metadata = {
  title: "Signup",
};
