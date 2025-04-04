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
import { CheckIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";
import CheckoutStripe from "../checkout/checkout-stripe";
import CancelSubscription from "./cancel-subscription";

const ManageSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col w-full min-w-[650px] h-[90%]">
          <DialogHeader>
            <DialogTitle>{t("label_manage_sub")}</DialogTitle>
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
      <DrawerContent className="flex flex-col p-3 max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle>{t("label_manage_sub")}</DrawerTitle>
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
  const filteredPlans = localPlans.filter((x) => x.type !== "free_trial");
  const showCancelButton = userStore.subscription.plan !== "free_trial";

  const query = useQuery({
    queryKey: ["manageSubData"],
    queryFn: async () => {
      console.log(userStore.locale);
      setLocalPlans(await getPlans(userStore.locale));
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6 overflow-y-auto h-full">
      <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto flex-1">
        {filteredPlans.map((plan) => (
          <CardTemplate key={plan.type} plan={plan} />
        ))}
      </div>
      <div className="flex sm:justify-between justify-center items-center gap-4">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          {t("label_close")}
        </Button>
        {showCancelButton && (
          <CancelSubscription>
            <Button variant="destructive_outline" size="sm" className="w-full sm:w-auto self-end">
              {t("label_cancel_sub")}
            </Button>
          </CancelSubscription>
        )}
      </div>
    </div>
  );
};
const CardTemplate = ({ plan }: { plan: IPlan }) => {
  const t = useTranslations("app");
  const { subscription } = useUserStore();
  const currentPlan = plan.type === subscription.plan;

  return (
    <div
      className={`${
        plan.isMostPopular ? "border-primary" : ""
      } relative flex flex-col items-center p-4 bg-background border-2 rounded-lg`}>
      <div className="flex flex-col w-full gap-3">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-semibold">{plan.name}</h3>
          {plan.isMostPopular && <Badge variant="green">{t("label_most_popular")}</Badge>}
        </div>
        <div className="flex w-full">
          <div className="">
            <span className="text-primary font-semibold text-lg">${plan.price} </span>
            <span className="text-xs">/ {t("label_per_month")}</span>
          </div>
        </div>
        <div className="w-full">
          <CheckoutStripe plan={plan.type}>
            <Button disabled={currentPlan} className="w-full" size="sm">
              {currentPlan ? t("label_current_plan") : plan.ctaButton}
            </Button>
          </CheckoutStripe>
        </div>
      </div>
      <div className="flex flex-1 justify-start items-start w-full">
        <ul className="mt-4 space-y-3 text-left w-full">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              {feature.comingSoon ? (
                <RocketIcon className="text-amber-500 w-4 h-4" />
              ) : (
                <CheckIcon className={`${plan.isMostPopular ? "text-primary" : "text-primary"} w-4 h-4`} />
              )}
              <span className={`${feature.comingSoon ? "text-foreground/80" : "font-semibold"} text-xs`}>
                {feature.description} {feature.comingSoon && `(${t("label_soon")})`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageSubscription;
