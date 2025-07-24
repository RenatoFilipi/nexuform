"use client";

import {
  createCheckoutSessionAction,
  getSubscriptionDetailsAction,
  updateSubscriptionPlanAction,
} from "@/app/actions/stripe-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { TAppState, TSetState } from "@/utils/types";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  LoaderIcon,
  XCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import PlanBadge from "../custom/plan-badge";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type TSelected = "starter" | "pro";

const ManageSubscription = ({ children, selected }: { children: React.ReactNode; selected?: TSelected }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-5xl max-h-[95%] h-full overflow-y-auto">
          <AlertDialogHeader className="hidden">
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
  const app = useAppStore();
  const isCurrentPlanAndActive = app.subscription.plan === plan.type && app.subscription.status === "active";

  if (isCurrentPlanAndActive) {
    return (
      <Card className="relative flex flex-col h-full p-5 rounded-xl border-muted-foreground/15 transition-colors opacity-50">
        {plan.isMostPopular && (
          <div className="absolute bg-primary text-white text-xs font-semibold px-3 py-1 w-fit h-fit top-4 right-4">
            {t("most_popular")}
          </div>
        )}
        <div className="flex flex-col w-full">
          <div className="flex justify-start items-center gap-2">
            <PlanBadge type={plan.type} />
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">{plan.description}</p>
        </div>
        <div className="flex justify-center items-center h-full py-6">
          <span>{t("label_current_plan")}</span>
        </div>
      </Card>
    );
  }

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
            <div className="flex justify-start items-center gap-2">
              <PlanBadge type={plan.type} />
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            </div>
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
  formData.append("customer_id", user.profile.stripe_customer_id!);
  formData.append("organization_id", app.organization.id);
  formData.append("profile_id", user.profile.id);
  formData.append("tmp_id", app.teamMemberProfile.id);
  formData.append("email", app.teamMemberProfile.email);
  formData.append("plan", plan.type);

  return (
    <div className="flex flex-col h-full w-full gap-6 overflow-y-auto">
      <div className="grid sm:grid-cols-2 flex-1 h-full gap-6 overflow-y-auto">
        <Card className="relative p-8 rounded-2xl bg-gradient-to-br from-muted/20 to-background border border-muted/30 shadow-lg h-full flex flex-col justify-between w-full overflow-hidden gap-4 overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex justify-start items-center gap-2">
                  <PlanBadge type={plan.type} />
                  <h3 className="text-2xl font-bold tracking-tight capitalize">{plan.name}</h3>
                </div>
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
  const [appState, setAppState] = useState<TAppState>("idle");
  const app = useAppStore();
  const formData = new FormData();
  formData.append("subscription_id", app.subscription.stripe_subscription_id as string);
  formData.append("plan", plan.type);

  const onConfirm = async () => {
    try {
      setAppState("loading");
      await updateSubscriptionPlanAction(formData);
      setAppState("success");
    } catch (error) {
      setAppState("error");
    }
  };

  const query = useQuery({
    queryKey: ["plan_id", app.subscription.stripe_subscription_id],
    queryFn: async () => {
      return await getSubscriptionDetailsAction(app.subscription.stripe_subscription_id as string);
    },
  });

  if (query.isPending)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <LoaderIcon className="w-7 h-7 animate-spin text-muted-foreground" />
      </div>
    );

  if (query.isError)
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex flex-col gap-6 justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <h2 className="text-lg font-semibold">{t("label_error_generic")}</h2>
            <p className="text-sm text-muted-foreground">{t("desc_error_generic")}</p>
          </div>
          <Button variant="outline" onClick={() => setPlan(null)} className="w-fit">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            {t("label_go_back")}
          </Button>
        </div>
      </div>
    );

  const currentPlanAmount = (query.data?.amount || 0) / 100;
  const newPlanAmount = plan.price.amount;
  const difference = newPlanAmount - currentPlanAmount;
  const isUpgrade = difference > 0;
  const isDowngrade = difference < 0;
  const isSamePrice = difference === 0;
  const formatPrice = (amount: number) => formatCurrency("USD", amount);

  if (appState === "loading") {
    return (
      <div className="flex flex-1 w-full h-full justify-center items-center flex-col gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
            damping: 10,
          }}
          className="relative">
          <LoaderIcon className="w-12 h-12 text-primary animate-pulse" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground font-medium tracking-wide animate-pulse">
          {t("label_updating_subscription")}
        </motion.p>
      </div>
    );
  }

  if (appState === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="p-5 rounded-full bg-destructive/10 backdrop-blur-sm">
          <XCircleIcon className="w-12 h-12 text-destructive" />
        </motion.div>
        <div className="space-y-3 max-w-md">
          <motion.h3
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold text-foreground">
            {t("label_update_failed")}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm leading-relaxed">
            {t("desc_update_failed")}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 pt-2">
          <Button variant="outline" onClick={() => setPlan(null)} className="">
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            {t("label_go_back")}
          </Button>
        </motion.div>
      </div>
    );
  }

  if (appState === "success") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center p-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-5 rounded-full bg-success/10 backdrop-blur-sm">
          <CheckCircleIcon className="w-14 h-14 text-success" />
        </motion.div>
        <div className="space-y-3 max-w-md">
          <motion.h3
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold text-foreground">
            {t("label_subscription_updated")}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm leading-relaxed">
            {t("desc_subscription_updated")}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4">
          <Button
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg transition-all hover:shadow-primary/30"
            asChild>
            <Link href="/dashboard/organizations">{t("label_return_to_dashboard")}</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 md:p-6 gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("label_plan_change_confirmation")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("desc_review_changes_before_confirmation")}</p>
        </div>
        <Button
          onClick={() => setPlan(null)}
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground">
          <ChevronLeftIcon className="w-4 h-4" />
          {t("label_back")}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <div className="flex-1">
          {/* New Plan Card - Focused Version */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-primary rounded-2xl p-8 bg-gradient-to-br from-card to-primary/5 shadow-lg">
            <div className="flex flex-col items-center text-center gap-6">
              {/* Plan Badge with Emphasis */}
              <div className="relative">
                <div className="p-4 rounded-xl bg-background border-2 border-primary/20 shadow-sm">
                  <PlanBadge type={plan.type} size="xl" />
                </div>
              </div>

              {/* Plan Details */}
              <div className="w-full space-y-2">
                <h3 className="text-2xl font-bold text-foreground capitalize">{plan.name}</h3>

                {/* Price Display */}
                <div className="mt-4">
                  <p className="text-5xl font-extrabold text-primary">
                    {formatPrice(newPlanAmount)}
                    <span className="text-base font-normal text-muted-foreground">/{t("label_month")}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary Section */}
        <div className="flex-1 space-y-6">
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{t("label_summary")}</h3>

            {/* Price Comparison */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">{t("label_current_plan")}</span>
                <span className="font-medium">{formatPrice(currentPlanAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">{t("label_new_plan")}</span>
                <span className="font-medium">{formatPrice(newPlanAmount)}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">{t("label_monthly_difference")}</span>
                <span
                  className={clsx(
                    "font-semibold",
                    isUpgrade ? "text-success" : isDowngrade ? "text-warning" : "text-muted-foreground"
                  )}>
                  {isSamePrice ? t("label_no_change") : `${isUpgrade ? "+" : "-"}${formatPrice(Math.abs(difference))}`}
                </span>
              </div>
            </div>
          </div>

          {/* Notices */}
          {app.subscription.plan === "pro" && plan.type === "starter" && (
            <Alert variant="warning" className="text-sm">
              <AlertTitle>{t("warning_downgrade_title")}</AlertTitle>
              <AlertDescription>{t("warning_downgrade_description")}</AlertDescription>
            </Alert>
          )}

          <p className="text-xs text-muted-foreground text-center">{t("desc_plan_change_notice")}</p>

          {/* Confirm Button */}
          <Button onClick={onConfirm} size="lg" className="w-full gap-2 mt-4" variant={"secondary"}>
            {isUpgrade ? t("label_upgrade_plan") : isDowngrade ? t("label_downgrade_plan") : t("label_confirm_change")}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;
