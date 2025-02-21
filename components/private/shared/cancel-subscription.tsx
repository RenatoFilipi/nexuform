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
import { plans } from "@/utils/constants";
import { TSetState } from "@/utils/types";
import { XIcon } from "lucide-react";
import { useState } from "react";

const CancelSubscription = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col w-full sm:min-w-[650px] p-6">
        <AlertDialogHeader className="">
          <AlertDialogTitle className="">Cancel Subscription</AlertDialogTitle>
          <AlertDialogDescription className="">
            Are you sure you want to cancel your subscription? You will lose access to all premium features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Body setState={setOpen} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Body = ({ setState }: { setState: TSetState<boolean> }) => {
  const { subscription } = useUserStore();
  const targetPlan = plans.find((x) => x.type === subscription.plan);

  if (!subscription) {
    return (
      <div className="">
        <p>No subscription data available.</p>
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="mt-4 w-full">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-sm">
            Started on: <strong>{new Date(subscription.start_date).toLocaleDateString()}</strong>
          </p>
          <p className="text-sm">
            Next payment due: <strong>{new Date(subscription.due_date).toLocaleDateString()}</strong>
          </p>
        </div>
        <div className="flex flex-col gap-2 bg-foreground text-background p-4 rounded">
          <span className="">You will lose access to all these features:</span>
          <div className="text-sm">
            {targetPlan?.features.map((feat) => (
              <div key={feat} className="flex items-center gap-2">
                <XIcon className="w-5 h-5 text-destructive" /> <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Alert variant="destructive" className="p-4 bg-red-100">
          <AlertDescription className="text-sm font-semibold">
            You will lose access to all content immediately upon canceling your subscription.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button onClick={() => setState(false)} variant="outline" size="sm" className="w-full">
              Close
            </Button>
            <Button
              onClick={() => setState(false)} // Ação de confirmação de cancelamento
              variant="destructive"
              size="sm"
              className="w-full bg-red-600 text-white hover:bg-red-700">
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
