"use client";

import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { getPlanName } from "@/utils/functions";
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
      const plan = getPlanName(subscription.plan);
      return { plan };
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex items-center justify-center h-dvh px-4 py-6 sm:px-6 w-full">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 p-8 rounded-xl border bg-card shadow-lg">
          <div className="md:w-2/3 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
                <WalletIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-medium">{t("label_upgrade_sub")}</h2>
                <p className="text-sm text-muted-foreground">{t("desc_upgrade_sub")}</p>
              </div>
            </div>

            {/* Additional content can go here */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">{t("label_current_plan")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("desc_current_plan", { subscription: query.data?.plan })}
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex flex-col justify-center">
            <div className="flex flex-col items-center gap-6 p-6 rounded-lg bg-muted/50">
              <Button className="w-full" size="lg" asChild>
                <Link href={"/dashboard/settings/billing"}>
                  {t("label_manage_sub")} <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground">{t("desc_manage_sub2")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUI;
