"use client";

import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription } from "@/utils/entities";
import { contactEmail } from "@/utils/envs";
import { useQuery } from "@tanstack/react-query";
import { CopyIcon, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface Props {
  locale: string;
  subscription: ESubscription;
  profile: EProfile;
  email: string;
  organizations: EOrganization[];
}

const HelpWrapper = (props: Props) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["helpData"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      return null;
    },
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    toast.success(t("label_link_copied"));
  };

  if (query.isPending) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <MailIcon className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{t("label_help")}</h1>
          <p className="text-muted-foreground">{t("desc_help")}</p>
        </div>
        <div className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">{t("label_contact_support")}</h2>
            <p className="text-sm text-muted-foreground">{t("desc_contact_support")}</p>
          </div>
          <div className="flex items-center justify-between bg-accent/50 p-3 rounded-md">
            <span className="font-mono text-sm truncate">{contactEmail}</span>
            <Button variant="outline" size="sm" onClick={handleCopyEmail} className="shrink-0">
              <CopyIcon className="h-4 w-4 mr-2" />
              {t("label_copy")}
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">{t("label_response_time_info")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpWrapper;
