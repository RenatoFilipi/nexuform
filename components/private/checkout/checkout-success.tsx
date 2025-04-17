"use client";

import Brand from "@/components/shared/core/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const CheckoutSuccess = () => {
  const t = useTranslations("app");
  return (
    <div className="flex justify-center items-center h-dvh relative" id="success">
      <Card className="flex flex-col justify-center items-center py-6 gap-8 relative px-10 mx-4 border-transparent">
        <Brand type="logo" className="h-10 fill-foreground absolute -top-16 hidden" />
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center bg-success/10 p-3 rounded">
            <ShoppingBagIcon className="w-8 h-8 text-success" />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-xl font-semibold">{t("label_active_sub")}</h1>
            <span className="text-sm text-foreground/60 text-center">{t("desc_active_sub")}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <Button asChild variant={"secondary"} size={"sm"} className="w-full">
            <Link href={"/dashboard/forms"}>{t("label_go_home")}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
