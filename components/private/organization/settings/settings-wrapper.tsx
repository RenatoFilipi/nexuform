"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { appName } from "@/utils/envs";
import { IContext } from "@/utils/interfaces";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangleIcon, LoaderIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import OptionSelector from "../../shared/custom/option-selector";
import RestrictedAccessUI from "../../shared/pages/restricted-access-ui";
import SubscriptionUI from "../../shared/pages/subscription-ui";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  context: IContext;
}

const SettingsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const isRootOrganization = app.organization.created_at_signup;

  const query = useQuery({
    queryKey: ["org-settings-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setContext(props.context);
      return null;
    },
  });

  if (query.isPending) return null;

  if (!app.context.isSubscriptionActive) {
    return <SubscriptionUI />;
  }

  if ((!app.context.isOrgOwner && app.subscription.plan !== "pro") || !app.context.isAdminOrHigher) {
    return <RestrictedAccessUI />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_settings")}</h1>
      </div>
      <div className="flex flex-col gap-10">
        <OrgSettings />
      </div>
    </div>
  );
};
const OrgSettings = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const supabase = createClient();
  const [appState, setAppState] = useState<TAppState>("idle");

  const schema = z.object({
    name: z.string(),
    status: z.string(),
  });

  const handler = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: app.organization.name,
      status: app.organization.status,
    },
  });

  const statusList = [
    {
      status: "active",
      label: t("label_active"),
      description: t("desc_org_active"),
      icon: PlayIcon,
      color: "bg-success/40 text-foreground border border-success p-2 rounded",
    },
    {
      status: "inactive",
      label: t("label_inactive"),
      description: t("desc_org_inactive"),
      icon: PauseIcon,
      color: "bg-warning/40 text-foreground border border-warning p-2 rounded",
    },
  ];

  const onSetStatus = (value: string) => {
    app.setOrganization({ ...app.organization, status: value });
    handler.setValue("status", value);
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setAppState("loading");
    try {
      const { name, status } = values;
      const { data, error } = await supabase
        .from("organizations")
        .update({ name, status })
        .eq("id", app.organization.id)
        .select()
        .single();
      if (error) throw new Error(t("err_generic"));

      app.setOrganization(data);
      toast.success(t("success_generic"));
    } catch (error) {
      toast.error(t("err_generic"));
    } finally {
      setAppState("idle");
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="font-semibold">{t("label_organization")}</h1>
          <p className="text-sm text-muted-foreground">{t("desc_organization_settings", { name: appName })}</p>
        </div>
        <Form {...handler}>
          <form onSubmit={handler.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-6 w-full">
              <FormField
                control={handler.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={handler.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("label_status")}</FormLabel>
                    <OptionSelector
                      options={statusList}
                      status={app.organization.status}
                      onStatusChange={onSetStatus}
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button variant={"secondary"} size={"sm"}>
                {appState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                {t("label_save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
const OrgDelete = () => {
  const t = useTranslations("app");

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-center gap-8 p-4 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold">{t("label_danger_zone")}</h1>
        <p className="text-sm text-muted-foreground">{t("desc_delete_org")}</p>
      </div>
      <div className="flex justify-end items-center w-full">
        <Button variant="destructive_outline" size="sm" className="">
          <AlertTriangleIcon className="w-4 h-4 mr-2" />
          {t("label_continue")}
        </Button>
      </div>
    </Card>
  );
};
export default SettingsWrapper;
