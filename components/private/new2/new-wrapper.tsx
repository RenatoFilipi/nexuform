"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePlatformStore from "@/stores/platform";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, ChevronRightIcon, HexagonIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import ManageSubscription from "../shared/subscription/manage-subscription";

type TView = "method:list" | "method:scratch" | "method:templates";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  forms: EForm[];
}
const NewWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const user = useUserStore();
  const [view, setView] = useState<TView>("method:list");
  const [isPending, startTransition] = useTransition();

  const query = useQuery({
    queryKey: ["new-form-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations([props.organization]);
      pf.setSubscriptions([props.subscription]);
      pf.setForms(props.forms);
      return null;
    },
  });

  const onNewScratchForm = async () => {};

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-xl">{t("label_create_form")}</span>
        <p className="text-sm text-muted-foreground">{t("desc_create_form")}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
        <MethodCard
          icon={
            <div className="p-3 rounded bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <PlusIcon className="w-6 h-6 text-blue-500" />
            </div>
          }
          description={t("desc_custom")}
          action={
            <Button
              disabled={isPending}
              variant={"outline"}
              size={"sm"}
              onClick={onNewScratchForm}
              className="mt-2 group-hover:border-primary group-hover:text-primary">
              {isPending && <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />}
              {t("label_create_form_scratch")}
            </Button>
          }
        />
        <MethodCard
          icon={
            <div className="p-3 rounded bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <HexagonIcon className="w-6 h-6 text-orange-500" />
            </div>
          }
          description={t("desc_templates")}
          action={
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => setView("method:templates")}
              className="mt-2 group-hover:border-primary group-hover:text-primary">
              {t("label_create_form_template")}
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          }
        />
      </div>
    </div>
  );
};

interface IMethodProps {
  icon: React.ReactNode;
  description: string;
  action: React.ReactNode;
}
const MethodCard = (props: IMethodProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const limitReached = pf.forms.length >= pf.subscriptions[0].forms;

  return (
    <Card className="flex justify-center items-center w-full border h-60 gap-4 flex-col p-6 rounded-lg hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group">
      {props.icon}
      <p className="text-sm text-center group-hover:text-foreground text-muted-foreground">{props.description}</p>
      {limitReached && (
        <ManageSubscription>
          <Button variant={"outline"} size={"sm"} className="mt-2 group-hover:border-primary group-hover:text-primary">
            {t("label_manage_sub")}
            <ArrowUpRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </ManageSubscription>
      )}
      {!limitReached && props.action}
    </Card>
  );
};

export default NewWrapper;
