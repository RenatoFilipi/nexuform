"use client";

import { createCheckoutSessionAction } from "@/app/actions/create-checkout-session";
import { updateSubscriptionPlanAction } from "@/app/actions/update-subscription-plan";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { minWidth640 } from "@/utils/constants";
import { IPlan } from "@/utils/interfaces";
import { getPlans } from "@/utils/plans";
import { TAppState, TPlan, TSetState } from "@/utils/types";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, CheckIcon, LoaderIcon, Rocket, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMedia } from "react-use";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const ManageSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-2xl max-h-[90%] h-full overflow-y-auto">
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
  const userStore = useUserStore();
  const [localPlans, setLocalPlans] = useState<IPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  const filteredPlans = localPlans.filter((x) => x.type !== "free_trial");

  const query = useQuery({
    queryKey: ["manageSubData"],
    queryFn: async () => {
      setLocalPlans(await getPlans(userStore.locale));
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-4 overflow-y-auto h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  selectedPlan ? "bg-primary text-primary-foreground" : "border border-primary text-primary"
                }`}>
                {selectedPlan ? <CheckIcon className="w-3 h-3" /> : "1"}
              </div>
              <span className={`font-medium ${selectedPlan ? "text-muted-foreground" : "text-primary"}`}>
                {t("label_available_plans")}
              </span>
            </div>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="mx-1" />
          <BreadcrumbItem>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  selectedPlan
                    ? "border border-primary text-primary"
                    : "border border-muted-foreground text-muted-foreground"
                }`}>
                2
              </div>
              <span className={`font-medium ${selectedPlan ? "text-primary" : "text-muted-foreground"}`}>
                {t("label_complete_subscription")}
              </span>
            </div>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {selectedPlan && <CheckoutFlow plan={selectedPlan} onBack={() => setSelectedPlan(null)} />}
      {!selectedPlan && (
        <div className="flex flex-col h-full flex-1 overflow-y-auto gap-6">
          <div className="flex flex-col overflow-y-auto gap-4 flex-1">
            {filteredPlans.map((plan) => (
              <PlanOption
                key={plan.type}
                plan={plan}
                isCurrent={plan.type === userStore.subscription.plan && userStore.subscription.status !== "canceled"}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="">
              {t("label_close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
const PlanOption = ({ plan, isCurrent, onSelect }: { plan: IPlan; isCurrent: boolean; onSelect: () => void }) => {
  const t = useTranslations("app");

  return (
    <div
      className={`${
        isCurrent ? "opacity-60" : "hover:border-primary hover:bg-primary/5"
      } relative p-4 rounded-lg border`}>
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
          <ul className="flex flex-col gap-2">
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
  const user = useUserStore();
  const isUpdatingSubscription =
    user.subscription.stripe_subscription_id !== null &&
    user.subscription.status !== "canceled" &&
    user.subscription.plan !== "free_trial";

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
          {t("label_back_to_plans")}
        </button>
        <div className="w-4"></div>
      </div>
      <div className="flex flex-col gap-6 h-full overflow-y-auto">
        <div className="p-4 rounded-lg bg-foreground/5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{plan.name}</h4>
              <p className="text-sm text-muted-foreground">{t("label_pricing_billed_monthly")}</p>
            </div>
            <p className="font-bold text-lg">${plan.price}/m</p>
          </div>
        </div>
        {isUpdatingSubscription ? <CheckoutUpdate plan={plan.type} /> : <CheckoutCreate plan={plan.type} />}
      </div>
    </div>
  );
};
const CheckoutCreate = ({ plan }: { plan: TPlan }) => {
  const user = useUserStore();
  const formData = new FormData();
  formData.append("customerId", user.profile.stripe_customer_id as string);
  formData.append("plan", plan as string);

  return (
    <div id="checkout" className="">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: () => createCheckoutSessionAction(formData) }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
const CheckoutUpdate = ({ plan }: { plan: TPlan }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const currentPlan = user.subscription.plan as TPlan;
  const intentPlan = plan;
  const [appState, setAppState] = useState<TAppState>("loading"); // "loading" | "idle" | "success" | "error"
  const formData = new FormData();
  formData.append("subscriptionId", user.subscription.stripe_subscription_id as string);
  formData.append("plan", intentPlan as string);

  const onConfirm = async () => {
    try {
      setAppState("loading");
      const res = await updateSubscriptionPlanAction(formData);
      if (!res) throw Error;
      setAppState("success");
    } catch (error) {
      setAppState("error");
    } finally {
      setAppState("idle");
    }
  };

  if (appState === "loading")
    return (
      <div className="flex flex-1 w-full h-full justify-center items-center flex-col gap-2">
        <LoaderIcon className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Updating subscription</span>
      </div>
    );
  if (appState === "success") return <div></div>;
  if (appState === "error") return <div></div>;
  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex items-center justify-center rounded-lg border p-6 text-sm bg-muted">
        <div className="text-center">
          <p className="mb-2">
            You are switching from <strong>{currentPlan}</strong> to <strong>{intentPlan}</strong>.
          </p>
          <p className="text-muted-foreground">
            This change will take effect immediately and may include prorated charges.
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onConfirm} variant={"secondary"} size={"sm"}>
          {t("label_complete_subscription")}
        </Button>
      </div>
    </div>
  );
};

export default ManageSubscription;
