"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import FormDelete from "../../shared/form/form-delete";
import FormStatus from "../form-status";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  form: EForm;
}

const SettingsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["formSettingssData"],
    queryFn: () => {
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setLocale(props.locale);
      global.setForm(props.form);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col w-full gap-4">
      <div>
        <span className="font-semibold text-lg sm:text-xl">{t("label_settings")}</span>
      </div>
      <div className="flex flex-col gap-10">
        <Status />
        <Delete />
      </div>
    </div>
  );
};

const Status = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");

  const onSetStatus = (value: string) => {
    global.setForm({ ...global.form, status: value });
  };

  const onSaveFormStatus = async () => {
    setAppState("loading");
    try {
      const { error } = await supabase.from("forms").update({ status: global.form.status }).eq("id", global.form.id);
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
        <FormStatus status={global.form.status as TFormStatus} onStatusChange={onSetStatus} />
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
const Delete = () => {
  const t = useTranslations("app");
  const global = useGlobalStore();

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-base">{t("label_danger_zone")}</h1>
        <p className="text-xs text-muted-foreground">{t("desc_danger_zone")}</p>
      </div>
      <div className="flex justify-end items-center w-full">
        <FormDelete formId={global.form.id} formName={global.form.name}>
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
