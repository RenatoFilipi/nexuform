"use client";

import Brand from "@/components/shared/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { HomeIcon, ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CheckoutSuccess = () => {
  const t = useTranslations("app");

  return (
    <div className="flex justify-center items-center min-h-dvh bg-gradient-to-br from-background/95 via-background to-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg">
        <Card className="p-8 sm:p-10 shadow-2xl overflow-hidden relative backdrop-blur-sm bg-background/80">
          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            {/* Logo/Brand with subtle animation */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Brand type="logo_text" className="h-8 fill-foreground" />
            </motion.div>

            {/* Animated success circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative">
              <div className="absolute inset-0 rounded-full bg-success/50 animate-ping opacity-75" />
              <div className="flex justify-center items-center bg-success/10 p-5 rounded-full border border-success/20">
                <div className="relative">
                  <ShoppingBagIcon className="w-10 h-10 text-success" />
                </div>
              </div>
            </motion.div>

            {/* Content with staggered animation */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground tracking-tight">
                {t("label_active_sub")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground/90 text-base leading-relaxed max-w-md mx-auto">
                {t("desc_active_sub")}
              </motion.p>
            </div>

            {/* Button with interactive animation */}
            <motion.div
              className="w-full pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}>
              <Button asChild className="w-full group" size="lg">
                <Link href="/dashboard/organizations">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  <span>{t("label_go_home")}</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
