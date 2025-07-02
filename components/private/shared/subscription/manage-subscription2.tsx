"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import WipUI from "../custom/wip-ui";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { IPlan, getPlans } from "@/utils/pricing";
import useUserStore from "@/stores/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckIcon, ClockIcon } from "lucide-react";

const ManageSubscription2 = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-5xl max-h-[90%] h-full overflow-y-auto">
          <AlertDialogHeader className="">
            <AlertDialogTitle className="">{t("label_manage_sub")}</AlertDialogTitle>
            <AlertDialogDescription>{t("desc_manage_sub")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const [localPlans, setLocalPlans] = useState<IPlan[]>([]);

  const query = useQuery({
    queryKey: ["manage-subscription-modal"],
    queryFn: async () => {
      const plans = (await getPlans(user.locale)).filter((x) => x.type !== "free_trial");
      setLocalPlans(plans);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid sm:grid-cols-2 w-full h-full gap-6">
        {localPlans.map((p) => {
          return <PlanCard plan={p} key={p.id} />;
        })}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="">
          {t("label_close")}
        </Button>
      </div>
    </div>
  );
};
const PlanCard = ({ plan }: { plan: IPlan }) => {
  const t = useTranslations("pricing");
  return (
    <Card
      className={`relative flex flex-col h-full p-5 rounded-xl border-muted-foreground/15 hover:border-primary transition-colors`}>
      {plan.isMostPopular && (
        <div className="absolute bg-primary text-white text-xs font-semibold px-3 py-1 w-fit h-fit top-4 right-4">
          {t("most_popular")}
        </div>
      )}
      <div className="flex flex-col justify-between h-full items-center w-full gap-6">
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col w-full">
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            <p className="mt-2 text-muted-foreground text-sm">{plan.description}</p>
          </div>
          <div className="flex items-center">
            <span className="text-4xl">${plan.price.amount}</span>
            {!plan.freeTrialDuration && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">/{t("month")}</span>
            )}
          </div>
          <ul className="flex flex-col gap-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                {feature.comingSoon ? (
                  <div className="flex">
                    <ClockIcon className="w-4 h-4 text-muted-foreground/70" />
                  </div>
                ) : (
                  <div className={`flex`}>
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  </div>
                )}
                <span
                  className={`ml-3 text-xs ${
                    feature.comingSoon ? "text-muted-foreground/70" : "text-muted-foreground"
                  }`}>
                  {feature.description}
                  {feature.comingSoon && (
                    <span className="ml-1 text-xs text-muted-foreground/70">({t("coming_soon")})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full">
          <Button className="w-full" variant={plan.isMostPopular ? "secondary" : "outline"}>
            {plan.ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ManageSubscription2;
