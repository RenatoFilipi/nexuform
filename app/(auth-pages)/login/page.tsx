import AuthPanel from "@/components/public/auth/auth-panel";
import LoginForm from "@/components/public/auth/login-form";
import { Metadata } from "next";

const Login = () => {
  return (
    <div className="min-h-dvh flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <div className="w-full flex justify-center items-center h-full bg-background">
          <div className="flex flex-col items-center justify-center w-full sm:max-w-[450px] gap-6 sm:p-0 px-12">
            <LoginForm />
          </div>
        </div>
      </div>
      <AuthPanel />
    </div>
  );
};

export default Login;

export const metadata: Metadata = {
  title: "Login",
};
