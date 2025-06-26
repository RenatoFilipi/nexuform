"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useUserStore from "@/stores/user";
import useAppStore from "@/stores/v2/app";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import FormDelete from "../../../private/shared/form/form-delete";
import SettingsFormStatus from "./settings-form-status";

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
        <span className="font-semibold text-lg sm:text-xl">{t("label_settings")}</span>
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
          <p className="text-xs text-muted-foreground">{t("desc_status")}</p>
        </div>
        <SettingsFormStatus status={app.form.status as TFormStatus} onStatusChange={onSetStatus} />
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
        <p className="text-xs text-muted-foreground">{t("desc_danger_zone")}</p>
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
