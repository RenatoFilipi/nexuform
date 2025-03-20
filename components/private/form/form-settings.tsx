"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookDashedIcon, GlobeIcon, LoaderIcon, MonitorOffIcon, ShieldAlertIcon, WrenchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormDelete from "../shared/form-delete";

type TView = "general" | "status" | "delete";

const FormSettings = () => {
  const t = useTranslations("app");
  const views = [
    { label: t("nav_general"), icon: WrenchIcon, view: "general", enabled: true },
    { label: t("nav_status"), icon: GlobeIcon, view: "status", enabled: true },
    { label: t("nav_delete"), icon: ShieldAlertIcon, view: "delete", enabled: true },
  ];
  const [view, setView] = useState<TView>("general");
  const enabledViews = views.filter((x) => x.enabled);

  return (
    <div className="flex w-full h-full gap-6 flex-col sm:flex-row">
      <div className="flex gap-1 sm:gap-3 flex-row sm:flex-col h-full sm:h-fit w-full sm:w-[260px]">
        {enabledViews.map((v) => {
          return (
            <button
              key={v.view}
              onClick={() => setView(v.view as TView)}
              className={`${
                v.view === view ? "border-foreground/30 font-medium" : "border-transparent text-foreground/70"
              } border p-2 flex items-center justify-center sm:justify-start gap-2 text-xs hover:bg-foreground/5 rounded flex-1`}>
              <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
              {v.label}
            </button>
          );
        })}
      </div>
      <div className="flex w-full">
        {view === "general" && <GeneralSettings />}
        {view === "status" && <StatusSettings />}
        {view === "delete" && <DeleteSettings />}
      </div>
    </div>
  );
};
const GeneralSettings = () => {
  const t = useTranslations("app");
  const supabase = createClient();
  const [settingsState, setSettingsState] = useState<TAppState>("idle");
  const { form, setForm } = useFormStore();
  const user = useUserStore();

  const formSchema = z.object({
    name: z.string().min(3, t("required_n_letters", { n: 3 })),
    description: z.string(),
    submitText: z.string().min(3, t("required_submit_text")),
    newSubmissionNotification: z.boolean(),
    nebulaformBranding: z.boolean(),
  });
  const formHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: form.name,
      description: form.description ?? "",
      submitText: form.submit_text,
      newSubmissionNotification: form.new_submission_notification,
      nebulaformBranding: form.nebulaform_branding,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, description, submitText, newSubmissionNotification, nebulaformBranding } = values;

    setSettingsState("loading");
    const { data, error } = await supabase
      .from("forms")
      .update({
        name,
        description,
        submit_text: submitText,
        new_submission_notification: newSubmissionNotification,
        nebulaform_branding: nebulaformBranding,
      })
      .eq("id", form.id)
      .select("*")
      .single();

    if (error) {
      toast.error(t("err_generic"));
      setSettingsState("idle");
      return;
    }
    setForm(data);
    toast.success(t("suc_update_form"));
    setSettingsState("idle");
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">{t("label_general")}</h1>
        <p className="text-xs text-foreground/70">{t("desc_general")}</p>
      </div>
      <Form {...formHandler}>
        <form onSubmit={formHandler.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-8">
            <FormField
              control={formHandler.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">{t("label_form_name")}</FormLabel>
                    <p className="text-xs text-foreground/70">{t("desc_form_name")}</p>
                  </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder={t("placeholder_form_name")} className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">{t("label_form_desc")}</FormLabel>
                    <p className="text-xs text-foreground/70">{t("desc_form_desc")}</p>
                  </div>
                  <FormControl>
                    <Textarea {...field} placeholder={t("placeholder_form_desc")} className="text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="submitText"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">{t("label_submit_text")}</FormLabel>
                    <p className="text-xs text-foreground/70">{t("desc_submit_text")}</p>
                  </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Submit button text" className="text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="newSubmissionNotification"
              render={({ field }) => (
                <FormItem className="justify-between items-center hidden">
                  <div className="grid gap-1">
                    <FormLabel>New submission notification</FormLabel>
                    <span className="text-xs text-foreground/70">
                      Receive an email whenever a new submission is received.
                    </span>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="nebulaformBranding"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <div className="grid gap-1">
                    <div className="flex justify-start items-center gap-2">
                      <FormLabel>{t("label_nebula_branding")}</FormLabel>
                      {user.subscription.plan !== "pro" && <Badge variant={"pink"}>Pro</Badge>}
                    </div>
                    <span className="text-xs text-foreground/70">{t("desc_nebula_branding")}</span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => {
                        if (user.subscription.plan === "pro") {
                          field.onChange(e);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end items-center w-full">
              <Button variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
                {settingsState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                {t("label_save_form")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
const StatusSettings = () => {
  const t = useTranslations("app");
  const statusList = [
    {
      status: "draft",
      label: t("label_draft"),
      description: t("desc_draft"),
      icon: BookDashedIcon,
    },
    {
      status: "published",
      label: t("label_published"),
      description: t("desc_published"),
      icon: GlobeIcon,
    },
    {
      status: "inactive",
      label: t("label_inactive"),
      description: t("desc_inactive"),
      icon: MonitorOffIcon,
    },
  ];
  const supabase = createClient();
  const [settingsState, setSettingsState] = useState<TAppState>("idle");
  const { form, setForm } = useFormStore();
  const [status, setStatus] = useState(form.status);

  const onSetStatus = (value: string) => {
    setStatus(value);
  };

  const onSubmit = async () => {
    setSettingsState("loading");

    const { data, error } = await supabase
      .from("forms")
      .update({
        status,
      })
      .eq("id", form.id)
      .select("*")
      .single();

    if (error) {
      toast.error(t("err_generic"));
      setSettingsState("idle");
      return;
    }
    setForm(data);
    toast.success(t("suc_update_form"));
    setSettingsState("idle");
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">{t("label_status")}</h1>
        <p className="text-xs text-foreground/70">{t("desc_status")}</p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 overflow-y-auto sm:grid-cols-1 w-full">
          {statusList.map((statusItem, index) => (
            <button
              key={index}
              onClick={() => onSetStatus(statusItem.status)}
              className={`${
                statusItem.status === status ? "border-primary bg-primary/5" : "hover:bg-foreground/5"
              } border p-4 flex gap-4 h-full w-full`}>
              <div className="flex items-center justify-center">
                <statusItem.icon
                  className={`${statusItem.status === status ? "text-primary" : "text-foreground/40"} w-5 h-5`}
                />
              </div>
              <div className="flex flex-col justify-center items-start gap-1">
                <span className="font-medium">{statusItem.label}</span>
                <span className="text-xs text-foreground/70 text-start">{statusItem.description}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end items-center w-full">
          <Button variant={"secondary"} size={"sm"} onClick={onSubmit} className="w-full sm:w-fit">
            {settingsState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            {t("label_save_form")}
          </Button>
        </div>
      </div>
    </div>
  );
};
const DeleteSettings = () => {
  const t = useTranslations("app");
  const { form } = useFormStore();

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">{t("label_delete_form")}</h1>
        <p className="text-xs text-foreground/70">{t("desc_delete_form")}</p>
      </div>
      <div className="flex justify-center items-center w-full border bg-destructive/5 rounded border-destructive/50 sm:py-20 px-6 py-6">
        <div className="flex flex-col justify-center items-center gap-4">
          <Badge variant={"destructive"} uppercase className="w-fit">
            {t("label_danger_zone")}
          </Badge>
          <div className="flex flex-col justify-center items-center gap-6">
            <span className="text-sm text-center font-medium">{t("desc_danger_zone")}</span>
            <FormDelete formId={form.id} formName={form.name}>
              <Button variant={"destructive"} size={"sm"} className="w-fit">
                {t("label_continue")}
              </Button>
            </FormDelete>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormSettings;
