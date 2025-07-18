import { Card } from "@/components/ui/card";
import { ShieldIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const RestrictedAccessUI = () => {
  const t = useTranslations("app");

  return (
    <Card className="flex w-full justify-center items-center flex-col gap-4 py-36 px-4">
      <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
        <ShieldIcon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex flex-col justify-center items-center gap-1 text-center">
        <h3 className="text-xl font-bold text-foreground">{t("label_no_access")}</h3>
        <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("desc_no_access")}</p>
      </div>
    </Card>
  );
};

export default RestrictedAccessUI;
