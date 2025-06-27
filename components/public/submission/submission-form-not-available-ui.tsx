"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SubmissionFormNotAvailableUI = () => {
  const t = useTranslations("app");

  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col gap-4 justify-center items-center">
          <span className="text-sm text-muted-foreground">{t("label_form_not_available")}</span>
          <div className="flex justify-center items-center w-full">
            <Button variant={"outline"} size={"xs"}>
              <Link href={"/"}>{t("label_go_back")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFormNotAvailableUI;
