"use client";

import { fetchBasicPlanAction, fetchProPlanAction } from "@/app/actions/stripe";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUserStore from "@/stores/user";
import { TPlan } from "@/utils/types";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslations } from "next-intl";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ children, plan }: { children: React.ReactNode; plan: TPlan }) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);
  const { email } = useUserStore();

  const formData = new FormData();
  formData.append("email", email);

  const options = {
    fetchClientSecret: () => (plan === "basic" ? fetchBasicPlanAction(formData) : fetchProPlanAction(formData)),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col w-full min-w-[650px] max-h-[90%] overflow-y-auto p-0">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle>{t("label_checkout")}</DialogTitle>
          <DialogDescription>{t("desc_checkout")}</DialogDescription>
        </DialogHeader>
        <div id="checkout" className="overflow-y-auto pb-6">
          {plan === "basic" && (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
          {plan === "pro" && (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
