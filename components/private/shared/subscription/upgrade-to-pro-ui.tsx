"use client";

import CheckoutStripe from "@/components/private/checkout/checkout-stripe";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { proPricing } from "@/utils/envs";
import { getPlans } from "@/utils/plans";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, CheckIcon, GemIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const UpgradeToProUI = ({
  email,
  profile,
  subscription,
  locale,
}: {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  locale: string;
}) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["upgradeToProUIData"],
    queryFn: async () => {
      user.setEmail(email);
      user.setProfile(profile);
      user.setSubscription(subscription);
      const plan = (await getPlans(locale)).filter((x) => x.type === "pro")[0];
      return { plan };
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex items-center justify-center min-h-dvh px-4 py-12 sm:px-6 w-full bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 p-8 rounded-xl border bg-card shadow-lg">
          {/* Left side - Features */}
          <div className="md:w-1/2">
            <div className="space-y-6">
              <div className="flex flex-col items-start gap-4">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-primary/20 blur-sm"></div>
                  <div className="flex justify-center items-center p-4 w-fit rounded-full bg-primary/10">
                    <GemIcon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <h2 className="text-2xl font-bold tracking-tight">{t("label_upgrade_pro")}</h2>
                  <p className="text-muted-foreground">{t("desc_upgrade_pro")}</p>
                </div>
              </div>

              <div className="w-full space-y-4">
                {query.data?.plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <p className="text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Pricing and CTA */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="flex flex-col items-center gap-8 p-6 rounded-lg bg-muted-foreground/5">
              <div className="text-center">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-4xl font-bold">${proPricing}</span>
                  <span className="text-muted-foreground">/{t("label_per_month")}</span>
                </div>
              </div>
              <CheckoutStripe plan="pro">
                <Button className="w-full" size="lg">
                  <GemIcon className="w-5 h-5 mr-2" />
                  {t("label_upgrade_pro")}
                  <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </CheckoutStripe>
              <p className="text-xs text-center text-muted-foreground">{t("label_cancel_anytime")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToProUI;
