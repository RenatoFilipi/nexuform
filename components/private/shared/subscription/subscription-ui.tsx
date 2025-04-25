"use client";

import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SubscriptionUI = ({
  email,
  locale,
  profile,
  subscription,
}: {
  email: string;
  locale: string;
  profile: EProfile;
  subscription: ESubscription;
}) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["subscriptionUIData"],
    queryFn: () => {
      user.setLocale(locale);
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
          <WalletIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-6">
          <div className="text-center flex flex-col justify-center items-center gap-1">
            <h2 className="text-lg font-medium">{t("label_upgrade_sub")}</h2>
            <p className="text-sm text-muted-foreground">{t("desc_upgrade_sub")}</p>
          </div>
          <div className="flex justify-center items-center w-fit">
            <Button variant={"outline"} size={"sm"} asChild>
              <Link href={"/dashboard/settings/billing"}>
                {t("label_manage_sub")} <ArrowUpRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUI;
