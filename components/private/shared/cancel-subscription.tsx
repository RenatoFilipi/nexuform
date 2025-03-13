"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { plans } from "@/utils/plans";
import { TSetState } from "@/utils/types";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CancelSubscription = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col w-full sm:min-w-[650px] p-6">
        <AlertDialogHeader className="">
          <AlertDialogTitle className="">{t("label_sub_cancel")}</AlertDialogTitle>
          <AlertDialogDescription className="">{t("desc_sub_cancel")}</AlertDialogDescription>
        </AlertDialogHeader>
        <Body setState={setOpen} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const t = useTranslations("app");
  const { subscription } = useUserStore();
  const targetPlan = plans.find((x) => x.type === subscription.plan);

  if (!subscription) {
    return (
      <div className="">
        <p>{t("label_no_sub_data")}</p>
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="mt-4 w-full">
          {t("label_close")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-sm">
            {t("label_sub_start")}: <strong>{new Date(subscription.start_date).toLocaleDateString()}</strong>
          </p>
          <p className="text-sm">
            {t("label_sub_next")}: <strong>{new Date(subscription.due_date).toLocaleDateString()}</strong>
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-foreground text-background p-4 rounded">
          <span className="">{t("label_sub_cancel_alert")}:</span>
          <div className="text-sm">
            {targetPlan?.features.map((feat) => (
              <div key={feat.description} className="flex items-center gap-2">
                <XIcon className="w-5 h-5 text-destructive" />{" "}
                <span>
                  {feat.description} {feat.comingSoon && `(${t("label_soon")})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Alert variant="destructive" className="p-4 bg-red-100">
          <AlertDescription className="text-sm font-semibold">{t("label_sub_cancel_warning_feats")}.</AlertDescription>
        </Alert>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-between w-full">
            <Button onClick={() => setState(false)} variant="outline" size="sm">
              {t("label_close")}
            </Button>
            <Button onClick={() => setState(false)} variant="destructive" size="sm" className="">
              {t("label_sub_cancel_confirm")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
