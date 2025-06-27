"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="flex items-center justify-center min-h-dvh px-4 py-12 sm:px-6 w-full">
      <Card>
        <div className="flex justify-center items-center flex-col sm:flex-row">
          {/* Left Content */}
          <div className="flex-1 p-8">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 flex justify-center items-center p-3.5 rounded-lg bg-primary/10 border border-primary/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <WalletIcon className="w-7 h-7 text-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("label_upgrade_sub")}</h2>
                <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">{t("desc_upgrade_sub")}</p>
              </div>
            </div>
          </div>

          {/* Right Content - Vertical Divider and Button */}
          <div className="relative md:w-[280px] flex flex-col justify-center p-8 bg-gradient-to-b from-muted/15 to-muted/5">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent hidden md:block"></div>
            <div className="flex flex-col items-center gap-6">
              <Button size="default" asChild>
                <Link href={"/dashboard/settings/billing"}>
                  <span className="flex items-center justify-center font-medium">
                    {t("label_manage_sub")}
                    <ArrowUpRightIcon className="w-5 h-5 ml-2" />
                  </span>
                </Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground leading-snug px-2">{t("desc_manage_sub2")}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionUI;
