"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { templateMainColors } from "@/utils/constants";
import { EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { IContext } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, DraftingCompassIcon, GlobeIcon, LoaderIcon, PauseCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import OptionSelector from "../../shared/custom/option-selector";
import RestrictedAccessUI from "../../shared/pages/restricted-access-ui";
import UpdateSubscriptionUI from "../../shared/pages/update-subscription-ui";
import FormDelete from "./settings-form-delete";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  context: IContext;
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
      app.setContext(props.context);
      return null;
    },
  });

  const isNotStaff = app.context.orgRole !== "staff";
  if (query.isPending) return null;

  if (!app.context.isOrgOwner && app.subscription.plan !== "pro") {
    return <RestrictedAccessUI />;
  }

  if (app.context.isSubscriptionExpired) {
    return <UpdateSubscriptionUI />;
  }

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      {/* header */}
      <div>
        <span className="font-semibold text-xl">{t("label_settings")}</span>
      </div>
      {/* content */}
      <div className="flex flex-col gap-10">
        <SettingsStatus />
        <SettingsLabelColor />
        {isNotStaff && <SettingsDelete />}
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
      color: "bg-info/30 text-foreground border border-info/60 p-2 rounded",
    },
    {
      status: "published",
      label: t("label_published"),
      description: t("desc_published"),
      icon: GlobeIcon,
      color: "bg-success/30 text-foreground border border-success/60 p-2 rounded",
    },
    {
      status: "inactive",
      label: t("label_inactive"),
      description: t("desc_inactive"),
      icon: PauseCircleIcon,
      color: "bg-foreground/30 text-foreground border border-foreground/60 p-2 rounded",
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
const SettingsLabelColor = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const labelColor = app.form.label_color;
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");

  const onColorChange = (color: string) => {
    app.setForm({ ...app.form, label_color: color });
  };
  const onSaveLabelColor = async () => {
    setAppState("loading");
    try {
      const { error } = await supabase
        .from("forms")
        .update({ label_color: app.form.label_color })
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
      <div className="flex flex-col justify-center items-start gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-base">{t("label_label_color")}</h1>
          <p className="text-sm text-muted-foreground">{t("desc_label_color")}</p>
        </div>
        {/* melhore o design do body somente */}
        <div id="body" className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("label_current_label_color")}</h3>
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: labelColor }}
                className="w-10 h-10 rounded-lg shadow-md border text-muted-foreground transition-all hover:scale-105 cursor-pointer"
              />
              <span className="text-sm font-mono text-muted-foreground">{labelColor.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">{t("label_color_pallete")}</h3>
            <div className="flex gap-4 flex-wrap">
              {templateMainColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => onColorChange(color)}
                  className={`w-8 h-8 rounded-md cursor-pointer transition-all hover:scale-110 shadow-sm ${
                    labelColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <Button onClick={onSaveLabelColor} variant={"secondary"} size={"sm"} disabled={appState === "loading"}>
          {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
          {t("label_save")}
        </Button>
      </div>
    </Card>
  );
};

export default SettingsWrapper;
