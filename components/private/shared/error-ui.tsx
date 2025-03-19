import { Button } from "@/components/ui/button";
import { HandHelpingIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const ErrorUI = () => {
  const t = useTranslations("app");

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:px-6 lg:px-36 mt-36 w-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-foreground/5">
          <HandHelpingIcon className="w-6 h-6 text-foreground" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-1">
          <h2 className="text-lg font-medium">{t("label_error_generic")}</h2>
          <p className="text-sm text-foreground/70">{t("desc_error_generic")}</p>
          <Button variant={"outline"} size={"xs"} className="w-full sm:w-fit mt-4" asChild>
            <Link href={"/dashboard/forms"}>{t("label_go_home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorUI;
