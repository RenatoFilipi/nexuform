import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import { ArrowUpRightIcon, WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const UpdateSubscriptionUI = () => {
  const t = useTranslations("app");
  const app = useAppStore();

  return (
    <Card className="h-full w-full flex justify-between items-center flex-col gap-6">
      {/* Left Content */}
      <div className="flex-1 py-12 px-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0 flex justify-center items-center p-3 rounded-lg bg-foreground/5 border border-primary/30 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <WalletIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("label_upgrade_sub")}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("desc_upgrade_sub")}</p>
          </div>
        </div>
      </div>
      {/* Right Content - Vertical Divider and Button */}
      <div className="relative flex flex-col justify-center p-6 bg-gradient-to-br from-muted/20 via-background to-muted/10 rounded-lg w-full py-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent hidden md:block"></div>
        <div className="flex flex-col items-center gap-5 text-center">
          <Button size="default" asChild className="font-semibold shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/dashboard/organizations/${app.organization.public_id}/billing`}>
              <span className="flex items-center justify-center">
                {t("label_manage_sub")}
                <ArrowUpRightIcon className="w-5 h-5 ml-2" />
              </span>
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground leading-snug px-2">{t("desc_manage_sub2")}</p>
        </div>
      </div>
    </Card>
  );
};

export default UpdateSubscriptionUI;
