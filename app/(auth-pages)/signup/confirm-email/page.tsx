"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useQueryState } from "nuqs";

const ConfirmEmail = () => {
  const t = useTranslations("auth");
  const [error] = useQueryState("error");

  if (error)
    return (
      <div className="flex justify-center items-center w-full h-screen relative">
        <div className="flex flex-col justify-center items-center sm:p-0 px-6 gap-8">
          <div className="flex justify-center items-center p-2 rounded-xl bg-destructive/20">
            <XIcon className="w-12 h-12 text-destructive" />
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-center text-foreground/80 text-sm">{t("err_generic")}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex justify-center items-center w-full h-screen relative">
      <div className="flex flex-col justify-center items-center sm:max-w-96 sm:p-0 px-6 gap-8">
        <div className="flex justify-center items-center p-2 rounded-xl bg-success/20">
          <CheckIcon className="w-12 h-12 text-success" />
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-center text-foreground/80 text-sm">{t("label_suc_confirm_email")}</p>
          <Button variant={"secondary"} size={"sm"} asChild className="w-full">
            <Link href={"/"}>{t("label_continue_login")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
