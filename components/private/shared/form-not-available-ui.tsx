"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FormNotAvailableUI = () => {
  const t = useTranslations("app");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <span className="text-sm text-foreground/80">{t("label_form_not_available")}</span>
        <div className="flex justify-center items-center w-full">
          <Button variant={"outline"} size={"xs"}>
            <Link href={"/"}>{t("label_go_back")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormNotAvailableUI;
