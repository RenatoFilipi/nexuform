"use client";

import Brand from "@/components/shared/core/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
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
        <Card className="p-8 sm:p-10 shadow-2xl border-border/30 overflow-hidden relative backdrop-blur-sm bg-background/80">
          {/* Animated decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/5"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-success/5"
          />

          {/* Floating sparkles */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-10 text-yellow-400/30">
            <Sparkles size={24} />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-24 left-12 text-primary/30">
            <Sparkles size={20} />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            {/* Logo/Brand with subtle animation */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Brand type="logo_text" className="h-9 fill-foreground" />
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
              <div className="absolute inset-0 rounded-full bg-success/10 animate-ping opacity-75" />
              <div className="flex justify-center items-center bg-success/10 p-5 rounded-full border border-success/20">
                <div className="relative">
                  <ShoppingBag className="w-12 h-12 text-success" />
                </div>
              </div>
            </motion.div>

            {/* Content with staggered animation */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-foreground tracking-tight">
                {t("label_active_sub")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground/90 text-lg leading-relaxed max-w-md mx-auto">
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
                <Link href="/dashboard/settings/billing">
                  <span className="relative overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12" />
                    {t("label_go_home")}
                  </span>
                  <Sparkles className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
