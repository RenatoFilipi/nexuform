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
import { Separator } from "@/components/ui/separator";
import useUserStore from "@/stores/user";
import { getPlans } from "@/utils/plans";
import { TSetState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, LoaderIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const CancelSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full sm:min-w-[650px] h-[90%] p-0 overflow-y-auto">
          <div className="bg-destructive/10 p-6 border-b border-destructive/20">
            <AlertDialogHeader className="text-left">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-destructive" />
                <AlertDialogTitle className="text-destructive">{t("label_sub_cancel")}</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-destructive/80">{t("desc_sub_cancel")}</AlertDialogDescription>
            </AlertDialogHeader>
          </div>
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

  if (!subscription) {
    return (
      <div className="p-6">
        <p>{t("label_no_sub_data")}</p>
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="mt-4 w-full">
          {t("label_close")}
        </Button>
      </div>
    );
  }

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

export default CancelSubscription;
