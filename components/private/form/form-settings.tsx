"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { createClient } from "@/utils/supabase/client";
import { TAppState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookDashedIcon,
  EyeIcon,
  GlobeIcon,
  Layers2Icon,
  LoaderIcon,
  MonitorOffIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormDelete from "../shared/form-delete";

type TView = "general" | "status" | "delete";

const statusList = [
  {
    status: "draft",
    label: "Draft",
    description: `The form is being created or edited. It’s not available for users to access yet.`,
    icon: BookDashedIcon,
  },
  {
    status: "published",
    label: "Published",
    description: "The form is live and can be accessed, filled out, and submitted by users.",
    icon: GlobeIcon,
  },
  {
    status: "inactive",
    label: "Inactive",
    description: "The form is no longer available for users to fill out or submit.",
    icon: MonitorOffIcon,
  },
];
const views = [
  { label: "General", icon: Layers2Icon, view: "general", enabled: true },
  { label: "Status", icon: EyeIcon, view: "status", enabled: true },
  { label: "Delete", icon: ShieldAlertIcon, view: "delete", enabled: true },
];

const FormSettings = () => {
  const [view, setView] = useState<TView>("general");
  const enabledViews = views.filter((x) => x.enabled);

  return (
    <div className="flex w-full h-full flex-col sm:flex-row gap-4 sm:gap-0">
      <div className="flex sm:flex-col h-fit sm:w-60 gap-1 sm:absolute">
        {enabledViews.map((v) => {
          return (
            <button
              key={v.view}
              onClick={() => setView(v.view as TView)}
              className={`${
                v.view === view ? "border-foreground/30 font-medium" : "border-transparent text-foreground/70"
              } border p-2 flex items-center justify-center sm:justify-start gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
              <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
              {v.label}
            </button>
          );
        })}
      </div>
      <div className="flex w-full sm:ml-64">
        {view === "general" && <GeneralSettings />}
        {view === "status" && <StatusSettings />}
        {view === "delete" && <DeleteSettings />}
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const supabase = createClient();
  const [settingsState, setSettingsState] = useState<TAppState>("idle");
  const { form, setForm } = useFormStore();
  const user = useUserStore();

  const formSchema = z.object({
    name: z.string().min(3, "Name must contain at least 3 letters."),
    description: z.string(),
    submitText: z.string().min(3, "Submit text must contain at least 3 letters."),
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
      toast.error("Error on update the form.");
      setSettingsState("idle");
      return;
    }
    setForm(data);
    toast.success("Form updated with success.");
    setSettingsState("idle");
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">General</h1>
        <p className="text-xs text-foreground/70">Customize the overall settings of your form.</p>
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
                    <FormLabel className="font-semibold">Name</FormLabel>
                    <p className="text-xs text-foreground/70">
                      Provide a unique name for your form to identify it easily.
                    </p>
                  </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Enter form name" className="text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="grid gap-1">
                    <FormLabel className="font-semibold">Description</FormLabel>
                    <p className="text-xs text-foreground/70">
                      Add a brief description to inform users about the purpose of this form.
                    </p>
                  </div>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter form description" className="text-sm" />
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
                    <FormLabel className="font-semibold">Submit Text</FormLabel>
                    <p className="text-xs text-foreground/70">
                      Customize the text displayed on the form&apos;s submit button.
                    </p>
                  </div>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Submit button text" className="text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="newSubmissionNotification"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
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
                      <FormLabel>Nebulaform branding</FormLabel>
                      {user.subscription.plan !== "pro" && <Badge variant={"pink"}>Pro</Badge>}
                    </div>
                    <span className="text-xs text-foreground/70">
                      Show &quot;Powered by Nebulaform&quot; on your form.
                    </span>
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
              <Button variant={"default"} size={"sm"} className="w-full sm:w-fit">
                {settingsState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
                Save Form
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
const StatusSettings = () => {
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
      toast.error("Error on update the form.");
      setSettingsState("idle");
      return;
    }
    setForm(data);
    toast.success("Form updated with success.");
    setSettingsState("idle");
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">Status</h1>
        <p className="text-xs text-foreground/70">
          Manage the availability of your form by setting it as published, inactive, or in draft mode.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 overflow-y-auto grid-cols-1 w-full">
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
                <span className="text-xs text-foreground/70">{statusItem.description}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end items-center w-full">
          <Button variant={"default"} size={"sm"} onClick={onSubmit} className="w-full sm:w-fit">
            {settingsState === "loading" && <LoaderIcon className="w-4 h-4 animate-spin mr-2" />}
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
};
const DeleteSettings = () => {
  const { form } = useFormStore();

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-semibold text-base">Delete Form</h1>
        <p className="text-xs text-foreground/70">
          Permanently remove this form and all its data. This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-center items-center w-full border bg-destructive/5 rounded border-destructive/50 py-20">
        <div className="flex flex-col justify-center items-center gap-4">
          <Badge variant={"destructive"} uppercase className="w-fit">
            Danger Zone
          </Badge>
          <div className="flex flex-col justify-center items-center gap-6">
            <span className="text-sm text-center font-medium">
              Permanently delete this form and all its associated data from our servers.
              <br /> This action cannot be undone.
            </span>
            <FormDelete formId={form.id} formName={form.name}>
              <Button variant={"destructive"} size={"sm"} className="w-fit">
                Continue
              </Button>
            </FormDelete>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormSettings;
