"use client";

import Checkout from "@/components/shared/checkout";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { useQuery } from "@tanstack/react-query";
import { CrownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const UpgradeToProUI = ({ email }: { email: string }) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["upgradeToProUIData"],
    queryFn: () => {
      user.setEmail(email);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:px-6 lg:px-36 mt-36 w-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
          <CrownIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-6">
          <div className="text-center flex flex-col justify-center items-center gap-1">
            <h2 className="text-lg font-medium">{t("label_upgrade_pro")}</h2>
            <p className="text-sm text-foreground/70">{t("desc_upgrade_pro")}</p>
          </div>
          <div className="flex justify-center items-center w-fit">
            <Checkout plan="pro">
              <Button variant={"secondary"} size={"xs"}>
                {t("label_upgrade_pro")}
              </Button>
            </Checkout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToProUI;
