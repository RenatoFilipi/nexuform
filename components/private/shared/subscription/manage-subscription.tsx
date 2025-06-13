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
import { IPlan } from "@/utils/interfaces";
import { getPlans } from "@/utils/plans";
import { TAppState, TPlan, TSetState } from "@/utils/types";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  LoaderIcon,
  RocketIcon,
  SettingsIcon,
  XCircleIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PlanIcon = ({ type }: { type: string }) => {
  const icons = {
    free_trial: <ZapIcon className="w-5 h-5 text-purple-500" />,
    basic: <ZapIcon className="w-5 h-5 text-blue-500" />,
    pro: <RocketIcon className="w-5 h-5 text-emerald-500" />,
    business: <BriefcaseIcon className="w-5 h-5 text-amber-500" />,
    custom: <SettingsIcon className="w-5 h-5 text-cyan-500" />,
  };

  return icons[type as keyof typeof icons] || <ZapIcon className="w-5 h-5 text-primary" />;
};
const ManageSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
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
    queryKey: ["manage-sub-data"],
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
                  <RocketIcon className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <CheckIcon className="w-3.5 h-3.5 text-primary" />
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
            {!isCurrent && <ArrowRightIcon className="ml-1 w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
const CheckoutFlow = ({ plan, onBack }: { plan: IPlan; onBack: () => void }) => {
  const user = useUserStore();
  const isUpdatingSubscription =
    user.subscription.stripe_subscription_id !== null &&
    user.subscription.status !== "canceled" &&
    user.subscription.plan !== "free_trial";

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {isUpdatingSubscription && <CheckoutUpdate onBack={onBack} plan={plan} />}
      {!isUpdatingSubscription && <CheckoutCreate onBack={onBack} plan={plan} />}
    </div>
  );
};
const CheckoutCreate = ({ plan, onBack }: { plan: IPlan; onBack: () => void }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const formData = new FormData();
  formData.append("customerId", user.profile.stripe_customer_id as string);
  formData.append("plan", plan.type as string);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <XIcon className="w-4 h-4" />
          {t("label_back_to_plans")}
        </button>
        <div className="px-4 py-3 rounded bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-lg tracking-tight text-foreground/90">{plan.name}</h4>
              <p className="text-sm text-muted-foreground/80 mt-1">{t("label_pricing_billed_monthly")}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="checkout" className="overflow-y-auto">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret: () => createCheckoutSessionAction(formData) }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};
export const CheckoutUpdate = ({ plan, onBack }: { plan: IPlan; onBack: () => void }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const currentPlan = user.subscription.plan as TPlan;
  const intentPlan = plan.type;
  const [appState, setAppState] = useState<TAppState>("idle");
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
      <div className="flex flex-1 w-full h-full justify-center items-center flex-col gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <LoaderIcon className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground">
          {t("label_updating_subscription")}
        </motion.p>
      </div>
    );

  if (appState === "success")
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-4 rounded-full bg-success/10">
          <CheckCircleIcon className="w-12 h-12 text-success" />
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t("label_subscription_updated")}</h3>
          <p className="text-muted-foreground">{t("desc_subscription_updated")}</p>
        </div>
        <Button onClick={onBack} className="mt-4">
          {t("label_return_to_dashboard")}
        </Button>
      </div>
    );

  if (appState === "error")
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center p-6">
        <div className="p-4 rounded-full bg-destructive/10">
          <XCircleIcon className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t("label_update_failed")}</h3>
          <p className="text-muted-foreground">{t("desc_update_failed")}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            {t("label_go_back")}
          </Button>
          <Button onClick={onConfirm}>{t("label_try_again")}</Button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/20 to-background border border-muted/30 shadow-lg h-full flex flex-col justify-center items-center w-full overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/30 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between w-full max-w-md">
          {/* Current Plan */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4 p-5 bg-background/80 rounded-xl border border-muted/20 shadow-sm backdrop-blur-sm">
            <div className="p-3 rounded-full bg-background border shadow-sm">
              <PlanIcon type={currentPlan} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("label_current_plan")}
              </p>
              <p className="font-semibold text-lg capitalize mt-1 text-foreground">{currentPlan}</p>
            </div>
          </motion.div>

          {/* Animated arrow */}
          <motion.div
            animate={{
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="p-3 rounded-full bg-primary/10 text-primary shadow-md mx-4">
            <ArrowRightIcon className="w-6 h-6" />
          </motion.div>

          {/* New Plan */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4 p-5 bg-background/80 rounded-xl border border-primary/30 shadow-sm backdrop-blur-sm">
            <div className="p-3 rounded-full bg-background border shadow-sm border-primary/30">
              <PlanIcon type={intentPlan} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("label_new_plan")}
              </p>
              <p className="font-semibold text-lg capitalize mt-1 text-primary">{intentPlan}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center max-w-md">
          <p className="text-sm text-muted-foreground leading-relaxed">{t("desc_plan_change_notice")}</p>
        </motion.div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} size="sm" className="">
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          {t("label_back_to_plans")}
        </Button>
        <Button variant={"secondary"} onClick={onConfirm} size="sm" className="">
          {t("label_complete_subscription")}
        </Button>
      </div>
    </div>
  );
};

export default ManageSubscription;
