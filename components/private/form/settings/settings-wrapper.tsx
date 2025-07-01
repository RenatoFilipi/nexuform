"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, DraftingCompassIcon, LoaderIcon, PauseCircleIcon, RocketIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import OptionSelector from "../../shared/custom/option-selector";
import FormDelete from "./settings-form-delete";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
}

const SettingsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["share-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setForm(props.form);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      {/* header */}
      <div>
        <span className="font-semibold text-xl">{t("label_settings")}</span>
      </div>
      {/* content */}
      <div className="flex flex-col gap-10">
        <SettingsStatus />
        <SettingsDelete />
      </div>
    </div>
  );
};
const SettingsStatus = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");

  const statusList = [
    {
      status: "draft",
      label: t("label_draft"),
      description: t("desc_draft"),
      icon: DraftingCompassIcon,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
    },
    {
      status: "published",
      label: t("label_published"),
      description: t("desc_published"),
      icon: RocketIcon,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    {
      status: "inactive",
      label: t("label_inactive"),
      description: t("desc_inactive"),
      icon: PauseCircleIcon,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300",
    },
  ];

  const onSetStatus = (value: string) => {
    app.setForm({ ...app.form, status: value });
  };
  const onSaveFormStatus = async () => {
    setAppState("loading");
    try {
      const { error } = await supabase
        .from("forms")
        .update({ status: app.form.status })
        .eq("id", app.form.id as string);
      if (error) throw new Error(t("err_generic"));
      toast.success(t("suc_update_form"));
    } catch (error) {
      toast.error(t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-center items-start gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-base">{t("label_status")}</h1>
          <p className="text-sm text-muted-foreground">{t("desc_status")}</p>
        </div>
        <OptionSelector options={statusList} status={app.form.status} onStatusChange={onSetStatus} />
      </div>
      <div className="flex justify-end items-center">
        <Button onClick={onSaveFormStatus} variant={"secondary"} size={"sm"} disabled={appState === "loading"}>
          {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
          {t("label_save")}
        </Button>
      </div>
    </Card>
  );
};
const SettingsDelete = () => {
  const t = useTranslations("app");
  const app = useAppStore();

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-base">{t("label_danger_zone")}</h1>
        <p className="text-sm text-muted-foreground">{t("desc_delete_form")}</p>
      </div>
      <div className="flex justify-end items-center w-full">
        <FormDelete formId={app.form.id as string} formName={app.form.name as string}>
          <Button variant="destructive_outline" size="sm" className="">
            <AlertTriangleIcon className="w-4 h-4 mr-2" />
            {t("label_continue")}
          </Button>
        </FormDelete>
      </div>
    </Card>
  );
};

export default SettingsWrapper;
