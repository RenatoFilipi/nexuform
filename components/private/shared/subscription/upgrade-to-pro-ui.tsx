"use client";

import CheckoutStripe from "@/components/private/checkout/checkout-stripe";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { CrownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const UpgradeToProUI = ({
  email,
  profile,
  subscription,
}: {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
}) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["upgradeToProUIData"],
    queryFn: () => {
      user.setEmail(email);
      user.setProfile(profile);
      user.setSubscription(subscription);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col items-center justify-center h-dvh px-4 py-6 sm:px-6 w-full">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
          <CrownIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-6">
          <div className="text-center flex flex-col justify-center items-center gap-1">
            <h2 className="text-lg font-medium">{t("label_upgrade_pro")}</h2>
            <p className="text-sm text-muted-foreground">{t("desc_upgrade_pro")}</p>
          </div>
          <div className="flex justify-center items-center w-fit">
            <CheckoutStripe plan="pro">
              <Button variant={"outline"} size={"sm"}>
                <CrownIcon className="w-4 h-4 mr-2 text-amber-500" />
                {t("label_upgrade_pro")}
              </Button>
            </CheckoutStripe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToProUI;
