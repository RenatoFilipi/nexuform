"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { proPricing } from "@/utils/envs";
import { formatCurrency } from "@/utils/functions";
import { getPlans } from "@/utils/plans";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, RocketIcon, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ManageSubscription from "./manage-subscription";

interface IProps {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  locale: string;
}

const UpgradeToProUI = ({ email, profile, subscription, locale }: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["upgrade-to-pro-data"],
    queryFn: async () => {
      user.setLocale(locale);
      user.setEmail(email);
      user.setProfile(profile);
      user.setSubscription(subscription);
      const plan = (await getPlans(locale)).filter((x) => x.type === "pro")[0];
      return { plan };
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex items-center justify-center min-h-dvh px-4 py-12 sm:px-6 w-full">
      <Card className="flex flex-col sm:flex-row p-0 overflow-hidden shadow-sm w-full max-w-4xl">
        {/* Left side - Features */}
        <div className="space-y-4 p-6 md:w-1/2 bg-card/80">
          <div className="flex flex-col items-start gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur opacity-75 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative flex justify-center items-center p-3 w-fit rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                <RocketIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <h2 className="text-xl font-bold text-foreground">{t("label_upgrade_pro")}</h2>
              <p className="text-muted-foreground text-sm">{t("desc_upgrade_pro")}</p>
            </div>
          </div>
          <div className="w-full space-y-3">
            {query.data?.plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5 flex items-center justify-center p-1 rounded-full bg-primary/10 border border-primary/20">
                  <CheckIcon className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Right side - Pricing and CTA */}
        <div className="md:w-1/2 flex flex-col gap-4 justify-center items-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-l border-muted/20">
          <div className="text-center space-y-1">
            <div className="flex items-end justify-center gap-1">
              <span className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent">
                {formatCurrency("USD", proPricing)}
              </span>
              <span className="text-sm text-muted-foreground pb-1">/{t("label_per_month")}</span>
            </div>
          </div>
          <ManageSubscription>
            <Button className="w-full group rounded-lg py-4 shadow-sm" size="sm">
              <span className="text-primary-foreground text-sm font-semibold">{t("label_upgrade_pro")}</span>
            </Button>
          </ManageSubscription>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground/80 max-w-xs">{t("label_cancel_anytime")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UpgradeToProUI;
