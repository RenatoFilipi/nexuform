"use client";

import Brand from "@/components/shared/core/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CheckoutSuccess = () => {
  const t = useTranslations("app");

  return (
    <div className="flex justify-center items-center min-h-dvh bg-gradient-to-br from-background to-muted/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Card className="p-8 shadow-lg border-border/50 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-success/10" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            {/* Logo/Brand */}
            <Brand type="logo_text" className="h-8 fill-foreground mb-2" />

            {/* Success icon with animation */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-center items-center bg-success/10 p-4 rounded-full">
              <ShoppingBagIcon className="w-10 h-10 text-success" />
            </motion.div>

            {/* Content */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-foreground">
                {t("label_active_sub")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground">
                {t("desc_active_sub")}
              </motion.p>
            </div>

            {/* Button with hover effect */}
            <motion.div
              className="w-full pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}>
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard/settings/billing">{t("label_go_home")}</Link>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
