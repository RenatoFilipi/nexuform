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
import { minWidth640, plans } from "@/utils/constants";
import { IPlanLanding } from "@/utils/interfaces";
import { TSetState } from "@/utils/types";
import { CheckIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";

const ManageSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col w-full min-w-[650px]">
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
  const filteredPlans = plans.filter((x) => x.type !== "free_trial");

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto">
        {filteredPlans.map((plan) => (
          <CardTemplate key={plan.type} plan={plan} />
        ))}
      </div>
      <div className="flex sm:justify-end justify-center items-center">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};
const CardTemplate = ({ plan }: { plan: IPlanLanding }) => {
  const { subscription } = useUserStore();
  const currentPlan = plan.type === subscription.plan;

  return (
    <div
      className={`${
        plan.highlighted ? "border-primary" : ""
      } relative flex flex-col items-center p-4 bg-background border rounded-lg`}>
      <div className="flex flex-col w-full gap-3">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-primary font-semibold">{plan.name}</h3>
          {plan.highlighted && (
            <Badge variant="green" className="">
              Most Popular
            </Badge>
          )}
        </div>
        <div className="flex w-full">
          <span className="text-sm text-foreground/80">
            <span className="text-foreground font-semibold text-base">${plan.price} </span>/ per month
          </span>
        </div>
        <div className="w-full">
          <Button disabled={currentPlan} className="w-full" size="sm">
            {currentPlan ? "Current plan" : plan.buttonLabel}
          </Button>
        </div>
      </div>
      <div className="flex flex-1 justify-start items-start w-full">
        <ul className="mt-4 space-y-3 text-left w-full">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              {feature.includes("Soon") ? (
                <RocketIcon className="text-primary w-4 h-4" />
              ) : (
                <CheckIcon className={`${plan.highlighted ? "text-primary" : "text-primary"} w-4 h-4`} />
              )}
              <span className="text-xs font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ManageSubscription;
