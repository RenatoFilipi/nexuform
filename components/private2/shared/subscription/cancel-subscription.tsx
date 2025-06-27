"use client";

import { CancelSubscriptionAction } from "@/app/actions/auth";
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
import { Separator } from "@/components/ui/separator";
import useUserStore from "@/stores/user";
import { getPlans } from "@/utils/plans";
import { TPlan, TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangleIcon, ChevronLeftIcon, ChevronRightIcon, LoaderIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import PlanIcon from "../custom/plan-icon";

const CancelSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full max-w-2xl max-h-[90%] h-full overflow-y-auto">
          <AlertDialogHeader className="">
            <AlertDialogTitle className="text-destructive">{t("label_sub_cancel")}</AlertDialogTitle>
            <AlertDialogDescription className="">{t("desc_sub_cancel")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const [isPending, startTransition] = useTransition();
  const { subscription, locale } = useUserStore();
  const [success] = useQueryState("success");
  const [error] = useQueryState("error");
  const [continued, setContinued] = useState<boolean>(false);

  useQuery({
    queryKey: [success, error],
    queryFn: () => {
      if (success !== null) toast.success(success);
      if (error !== null) toast.error(error);
      return null;
    },
    refetchOnWindowFocus: false,
  });
  const query = useQuery({
    queryKey: ["cancelSubData"],
    queryFn: async () => {
      const plans = await getPlans(locale);
      const plan = plans.find((x) => x.type === subscription.plan);
      return { plan };
    },
  });
  const onCancelSubscription = async () => {
    startTransition(async () => {
      const formData = new FormData();
      if (subscription.stripe_subscription_id) {
        formData.append("stripeSubscriptionId", subscription.stripe_subscription_id);
        await CancelSubscriptionAction(formData);
      }
    });
  };
  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full">
      {continued && <CancelConfirm setState={setContinued} />}
      {!continued && (
        <div className="flex flex-1 flex-col justify-between gap-4">
          <Card className="border-muted/20 bg-gradient-to-br from-destructive/5 to-background p-6 shadow-sm h-full flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangleIcon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{t("label_sub_cancel_alert")}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {query.data?.plan?.features.map((feat) => (
                <div key={feat.description} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 p-1">
                    <XIcon className="h-3 w-3 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {feat.description} {feat.comingSoon && `(${t("label_soon")})`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => setState(false)} className="flex-1">
              {t("label_close")}
            </Button>
            <Button variant="destructive_outline" onClick={() => setContinued(true)} className="flex-1 gap-1.5">
              {t("label_continue")}
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="flex flex-col gap-6 h-full p-6 overflow-y-auto">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col bg-background p-4 rounded-lg border">
          <p className="text-sm">
            {t("label_sub_start")}: <strong>{new Date(subscription.start_date).toLocaleDateString()}</strong>
          </p>
          <p className="text-sm">
            {t("label_sub_next")}: <strong>{new Date(subscription.due_date).toLocaleDateString()}</strong>
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 bg-destructive/5 p-4 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangleIcon className="w-4 h-4" />
            <span className="font-semibold">{t("label_sub_cancel_alert")}:</span>
          </div>
          <div className="text-sm">
            {query.data?.plan?.features.map((feat) => (
              <div key={feat.description} className="flex items-center gap-2">
                <XIcon className="w-4 h-4 text-destructive" />{" "}
                <span className="text-sm">
                  {feat.description} {feat.comingSoon && `(${t("label_soon")})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center w-full py-6 border-2 border-destructive rounded-lg flex-col gap-4 bg-destructive/5">
          <div className="text-center">
            <span className="text-destructive font-medium flex justify-center items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5" />
              {t("label_sub_cancel_warning_feats")}
            </span>
            <p className="text-sm text-destructive/80 mt-1">{t("label_sub_cancel_warning_irreversible")}</p>
          </div>
          <Button
            disabled={isPending}
            onClick={() => {
              onCancelSubscription();
            }}
            variant="destructive"
            size="sm"
            className="font-bold py-5 px-8">
            {isPending ? (
              <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <AlertTriangleIcon className="w-4 h-4 mr-2" />
            )}
            {t("label_sub_cancel_confirm")}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-between w-full">
            <Button onClick={() => setState(false)} variant="outline" size="sm" className="w-full">
              {t("label_close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
const CancelConfirm = ({ setState }: { setState: TSetState<boolean> }) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("app");
  const user = useUserStore();
  const currentPlan = user.subscription.plan as TPlan;

  const onCancelSubscription = async () => {
    startTransition(async () => {
      const formData = new FormData();
      if (user.subscription.stripe_subscription_id) {
        formData.append("stripeSubscriptionId", user.subscription.stripe_subscription_id);
        await CancelSubscriptionAction(formData);
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <div className="relative p-8 rounded-2xl bg-gradient-to-b from-muted/20 to-destructive/10 border border-muted/30 shadow-lg h-full flex flex-col justify-center items-center w-full overflow-hidden gap-4">
        <div className="relative z-10 flex items-center justify-center w-full max-w-md">
          <motion.div
            id="card do plano atual"
            animate={{
              x: 0,
              opacity: 1,
              boxShadow: [
                "0 0 0 0 rgba(220, 38, 38, 0.7)",
                "0 0 0 10px rgba(220, 38, 38, 0)",
                "0 0 0 0 rgba(220, 38, 38, 0)",
              ],
              borderColor: ["rgb(220 38 38 / 0.7)", "rgb(220 38 38 / 0.3)", "rgb(220 38 38 / 0.7)"],
            }}
            transition={{
              delay: 0.2,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-1 text-center max-w-md flex flex-col justify-center items-center gap-4">
          <p className="text-sm text-destructive/80 mt-2">{t("label_sub_cancel_warning_irreversible")}</p>
        </motion.div>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setState(false)} size="sm" className="" disabled={isPending}>
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          {t("label_back_to_plans")}
        </Button>
        <Button
          variant={"destructive_outline"}
          disabled={isPending}
          onClick={onCancelSubscription}
          size="sm"
          className="">
          {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
          {t("label_sub_cancel_confirm")}
        </Button>
      </div>
    </div>
  );
};

export default CancelSubscription;
