"use client";

import { createCheckoutSessionAction } from "@/app/actions/stripe";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { formatCurrency } from "@/utils/functions";
import { IPlan, getPlans } from "@/utils/pricing";
import { TSetState } from "@/utils/types";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronLeftIcon, ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type TSelected = "starter" | "pro";

const ManageSubscription2 = ({ children, selected }: { children: React.ReactNode; selected?: TSelected }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-5xl max-h-[95%] h-full overflow-y-auto">
          <AlertDialogHeader className="">
            <AlertDialogTitle className="">{t("label_manage_sub")}</AlertDialogTitle>
            <AlertDialogDescription>{t("desc_manage_sub")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} selected={selected} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
const Body = ({ setState, selected }: { setState: TSetState<boolean>; selected?: TSelected }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const [localPlans, setLocalPlans] = useState<IPlan[]>([]);
  const [intentPlan, setIntentPlan] = useState<IPlan | null>(null);
  const hasIntentPlan = intentPlan !== null;
  const isUpdatingPlan =
    app.subscription.stripe_subscription_id !== null &&
    app.subscription.status !== "canceled" &&
    app.subscription.plan !== "free_trial";

  const query = useQuery({
    queryKey: ["manage-subscription-modal"],
    queryFn: async () => {
      const plans = (await getPlans(user.locale)).filter((x) => x.type !== "free_trial");
      setLocalPlans(plans);
      if (selected === "starter") setIntentPlan(plans.find((x) => x.type === "starter") as IPlan);
      if (selected === "pro") setIntentPlan(plans.find((x) => x.type === "pro") as IPlan);
      return null;
    },
  });

  if (query.isPending) return null;

  if (hasIntentPlan && !isUpdatingPlan) return <CheckoutNewPlan setPlan={setIntentPlan} plan={intentPlan} />;
  if (hasIntentPlan && isUpdatingPlan) return <CheckoutUpdatePlan setPlan={setIntentPlan} plan={intentPlan} />;

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto">
      <div className="grid sm:grid-cols-2 w-full h-full gap-6 overflow-y-auto">
        {localPlans.map((p) => {
          return <PlanCard plan={p} key={p.id} setPlan={setIntentPlan} />;
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
const PlanCard = ({ plan, setPlan }: { plan: IPlan; setPlan: TSetState<IPlan | null> }) => {
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
            <span className="text-4xl">{formatCurrency("USD", plan.price.amount, "compact")}</span>
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
          <Button
            onClick={() => setPlan(plan)}
            className="w-full"
            variant={plan.isMostPopular ? "secondary" : "outline"}>
            {plan.ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};
const CheckoutNewPlan = ({ plan, setPlan }: { plan: IPlan; setPlan: TSetState<IPlan | null> }) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const formData = new FormData();
  formData.append("orgId", app.organization.id);
  formData.append("plan", plan.type as string);
  formData.append("customerId", user.profile.stripe_customer_id as string);

  return (
    <div className="flex flex-col h-full w-full gap-6 overflow-y-auto">
      <div className="grid sm:grid-cols-2 flex-1 h-full gap-6 overflow-y-auto">
        <Card className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/20 to-background border border-muted/30 shadow-lg h-full flex flex-col justify-between w-full overflow-hidden gap-4 overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight capitalize">{plan.type.replace("_", " ")}</h3>
                <p className="text-muted-foreground mt-1">{plan.description}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 mt-2">
            {plan.features.map((feat) => {
              return (
                <div key={feat.description} className="flex justify-start items-center gap-3">
                  <CheckIcon className="w-4 h-4" />
                  <span className="text-xs text-muted-foreground">{feat.description}</span>
                </div>
              );
            })}
          </div>
          <div className="relative z-10 pt-6 border-t border-muted/30">
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize">{plan.type.replace("_", " ")}</span>
              <span className="text-sm text-muted-foreground">{formatCurrency("USD", plan.price.amount, "full")}</span>
            </div>
          </div>
        </Card>
        <Card id="checkout" className="overflow-y-auto">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret: () => createCheckoutSessionAction(formData) }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Card>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setPlan(null)} variant={"ghost"} size={"sm"} className="">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          {t("label_go_back")}
        </Button>
      </div>
    </div>
  );
};
const CheckoutUpdatePlan = ({ plan, setPlan }: { plan: IPlan; setPlan: TSetState<IPlan | null> }) => {
  const t = useTranslations("app");
  const app = useAppStore();

  return (
    <div className="flex flex-col h-full w-full gap-6">
      <Card className="flex justify-center items-center">Checkout update plan</Card>
      <div className="flex gap-4">
        <Button onClick={() => setPlan(null)} variant={"ghost"} size={"sm"} className="">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          {t("label_go_back")}
        </Button>
      </div>
    </div>
  );
};

export default ManageSubscription2;
