import LoginForm from "@/components/public/auth/login-form";
import { Metadata } from "next";

const Login = () => {
  return (
    <div className="min-h-dvh flex justify-center items-center">
      <LoginForm />
    </div>
  );
};

export default Login;

export const metadata: Metadata = {
  title: "Login",
};
