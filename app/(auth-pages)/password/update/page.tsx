import UpdatePasswordForm from "@/components/public/auth/update-password-form";
import { Metadata } from "next";
import { Suspense } from "react";

const Update = () => {
  return (
    <div className="min-h-dvh flex">
      <div className="flex-1 flex justify-center items-center w-full relative">
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-col items-center justify-center w-full sm:max-w-[450px] gap-6 sm:p-0 px-12">
            <Suspense>
              <UpdatePasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;

export const metadata: Metadata = {
  title: "Password update",
};
