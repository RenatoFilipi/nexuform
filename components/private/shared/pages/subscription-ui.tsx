"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import { ArrowUpRightIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const SubscriptionUI = () => {
  const t = useTranslations("app");
  const app = useAppStore();

  return (
    <Card className="w-full overflow-hidden border shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Left Content */}
        <div className="flex-1 p-8 md:p-10 bg-gradient-to-br from-background to-primary/5">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded bg-primary/10 backdrop-blur-sm border border-primary/20">
                <ZapIcon className="w-6 h-6 text-primary fill-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("label_upgrade_sub")}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground text-base leading-relaxed">{t("desc_upgrade_sub")}</p>
            </div>
          </div>
        </div>
        {/* Right Content */}
        <div className="w-full md:w-[280px] p-8 bg-background border-t md:border-t-0 md:border-l border-muted/30 flex flex-col justify-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <Button size="default" asChild className="w-full group transition-all hover:shadow-lg">
              <Link href={`/dashboard/organizations/${app.organization.public_id}/billing`}>
                <span className="flex items-center justify-center font-medium">
                  {t("label_manage_sub")}
                  <ArrowUpRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            </Button>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-snug">{t("desc_manage_sub2")}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionUI;
