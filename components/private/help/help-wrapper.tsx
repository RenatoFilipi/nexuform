"use client";

import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  subscription: ESubscription;
  profile: EProfile;
  email: string;
}

const HelpWrapper = ({ email, profile, subscription }: Props) => {
  const t = useTranslations("app");
  const userStore = useUserStore();
  const contact = "re.rosa98@gmail.com";

  const query = useQuery({
    queryKey: ["helpData"],
    queryFn: () => {
      userStore.setEmail(email);
      userStore.setProfile(profile);
      userStore.setSubscription(subscription);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col">
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-8">
        <div className="flex justify-center items-center gap-2 flex-col">
          <h1 className="text-2xl font-semibold">{t("label_help")}</h1>
          <span className="text-sm text-foreground/70 text-center">{t("desc_help")}</span>
        </div>
        <div
          className="flex justify-center items-center gap-4 bg-foreground text-background px-4 py-2
         rounded border">
          <span>{contact}</span>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => {
              navigator.clipboard.writeText(contact);
            }}>
            {t("label_copy")} <CopyIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpWrapper;
