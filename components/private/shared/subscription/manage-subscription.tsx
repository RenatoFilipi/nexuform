"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useUserStore from "@/stores/user";
import { minWidth640 } from "@/utils/constants";
import { IPlan } from "@/utils/interfaces";
import { getPlans } from "@/utils/plans";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, CreditCard, Rocket, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";
import CheckoutStripe from "../../checkout/checkout-stripe";
import CancelSubscription from "./cancel-subscription";

const ManageSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col w-full max-w-2xl max-h-[90%] h-full overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="font-bold tracking-tight">{t("label_manage_sub")}</DialogTitle>
            <DialogDescription>{t("desc_manage_sub")}</DialogDescription>
          </DialogHeader>
          <Body setState={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex flex-col p-4 max-h-[90%]">
        <DrawerHeader className="text-left border-b pb-4">
          <DrawerTitle className="font-bold">{t("label_manage_sub")}</DrawerTitle>
          <DrawerDescription>{t("desc_manage_sub")}</DrawerDescription>
        </DrawerHeader>
        <Body setState={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const userStore = useUserStore();
  const [localPlans, setLocalPlans] = useState<IPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  const filteredPlans = localPlans.filter((x) => x.type !== "free_trial");
  const showCancelButton = userStore.subscription.status !== "canceled" && userStore.subscription.plan !== "free_trial";

  const query = useQuery({
    queryKey: ["manageSubData"],
    queryFn: async () => {
      setLocalPlans(await getPlans(userStore.locale));
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      {!selectedPlan ? (
        <>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{t("label_available_plans")}</h3>
            <p className="text-sm text-muted-foreground">{t("desc_choose_plan")}</p>
          </div>

          <div className="flex flex-col overflow-y-auto gap-6 sm:pr-2">
            {filteredPlans.map((plan) => (
              <PlanOption
                key={plan.type}
                plan={plan}
                isCurrent={plan.type === userStore.subscription.plan && userStore.subscription.status !== "canceled"}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>

          <div className="flex gap-4 border-t pt-4">
            <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="">
              {t("label_close")}
            </Button>
            {showCancelButton && (
              <CancelSubscription>
                <Button variant="destructive_outline" size="sm" className="">
                  {t("label_cancel_sub")}
                </Button>
              </CancelSubscription>
            )}
          </div>
        </>
      ) : (
        <CheckoutFlow plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
      )}
    </div>
  );
};
const PlanOption = ({ plan, isCurrent, onSelect }: { plan: IPlan; isCurrent: boolean; onSelect: () => void }) => {
  const t = useTranslations("app");

  return (
    <div
      className={`relative p-4 rounded-lg border ${
        plan.isMostPopular ? "border-primary bg-primary/5" : "border-border"
      }`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              {plan.isMostPopular && (
                <Badge variant="green" className="px-2">
                  {t("label_most_popular")}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">${plan.price}</p>
            <p className="text-xs text-muted-foreground">{t("label_per_month")}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {feature.comingSoon ? (
                  <Rocket className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-primary" />
                )}
                <span className={feature.comingSoon ? "text-muted-foreground" : "text-xs"}>{feature.description}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={onSelect}
            disabled={isCurrent}
            size="sm"
            className="shrink-0"
            variant={isCurrent ? "outline" : "secondary"}>
            {isCurrent ? t("label_current_plan") : t("label_select")}
            {!isCurrent && <ArrowRight className="ml-1 w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
const CheckoutFlow = ({ plan, onBack }: { plan: IPlan; onBack: () => void }) => {
  const t = useTranslations("app");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
          {t("label_back_to_plans")}
        </button>
        <div className="w-4"></div>
      </div>
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{plan.name}</h4>
              <p className="text-sm text-muted-foreground">{t("label_pricing_billed_monthly")}</p>
            </div>
            <p className="font-bold text-lg">${plan.price}/m</p>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">{t("label_payment_details")}</h4>
          <div className="p-4 rounded-lg border flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">{t("label_credit_card")}</p>
              <p className="text-sm text-muted-foreground">{t("desc_stripe_payment")}</p>
            </div>
          </div>
        </div>

        <CheckoutStripe plan={plan.type}>
          <Button className="w-full" size="lg" variant={"secondary"}>
            {t("label_complete_subscription")}
          </Button>
        </CheckoutStripe>
      </div>

      <p className="text-xs text-muted-foreground text-center">{t("desc_secure_payment")}</p>
    </div>
  );
};

export default ManageSubscription;
