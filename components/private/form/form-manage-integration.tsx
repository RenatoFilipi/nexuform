import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useFormStore from "@/stores/form";
import { minWidth640 } from "@/utils/constants";
import { EIntegration } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TAppState, TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { toast } from "sonner";
import { z } from "zod";

const FormManageIntegration = ({ children, integration }: { children: React.ReactNode; integration: EIntegration }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Integration</DialogTitle>
            <DialogDescription>Manage and configure third-party integrations for your form.</DialogDescription>
          </DialogHeader>
          {integration.type === "google_sheets" && <ManageGoogleSheets setState={setOpen} integration={integration} />}
          {integration.type === "slack" && <ManageSlack setState={setOpen} integration={integration} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col gap-8 max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle>Integration</DrawerTitle>
          <DrawerDescription>Manage and configure third-party integrations for your form.</DrawerDescription>
        </DrawerHeader>
        {integration.type === "google_sheets" && <ManageGoogleSheets setState={setOpen} integration={integration} />}
        {integration.type === "slack" && <ManageSlack setState={setOpen} integration={integration} />}
      </DrawerContent>
    </Drawer>
  );
};
const ManageGoogleSheets = ({ setState, integration }: { setState: TSetState<boolean>; integration: EIntegration }) => {
  const supabase = createClient();
  const { integrations, setIntegrations } = useFormStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [active, setActive] = useState(integration.active);

  const formSchema = z.object({
    sheetId: z.string().min(1, "Sheet ID is required"),
    sheetName: z.string().min(1, "Sheet name is required"),
    range: z.string().min(1, "Range is required"),
    apiKey: z.string().min(1, "API key is required"),
  });
  const formHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetId: integration.gs_id ?? "",
      sheetName: integration.gs_name ?? "",
      range: integration.gs_data_range ?? "",
      apiKey: integration.gs_api_key ?? "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setAppState("loading");
    const { sheetId, sheetName, range, apiKey } = values;
    const { data, error } = await supabase
      .from("integrations")
      .update({ gs_id: sheetId, gs_name: sheetName, gs_data_range: range, gs_api_key: apiKey, active })
      .eq("id", integration.id)
      .select()
      .single();

    if (error) {
      toast.error("Error on updating integration, please try again.");
      setAppState("idle");
      return;
    }

    const updatedIntegrations = integrations.map((old) => {
      return old.id === data.id ? data : old;
    });
    setIntegrations(updatedIntegrations);
    setState(false);
    toast.success("Integration updated.");
    setAppState("idle");
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <Badge variant={"primary"} uppercase>
          Google Sheets
        </Badge>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>
      <Form {...formHandler}>
        <form onSubmit={formHandler.handleSubmit(onSubmit)} className="flex flex-col overflow-y-auto gap-4">
          <div className="h-full flex flex-col gap-8 overflow-y-auto  ">
            <FormField
              control={formHandler.control}
              name="sheetId"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Google Sheet ID</FormLabel>
                    <span className="text-xs text-foreground/60">The unique ID of your Google Sheet.</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter your Sheet ID" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="sheetName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Sheet Name</FormLabel>
                    <span className="text-xs text-foreground/60">
                      The name of the specific sheet within the document.
                    </span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter your Sheet Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="range"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Data Range (Optional)</FormLabel>
                    <span className="text-xs text-foreground/60">
                      Specify the cell range, e.g., A1:C10. Leave empty for the entire sheet.
                    </span>
                  </div>
                  <FormControl>
                    <Input placeholder="Example: A1:C10" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Google API Key</FormLabel>
                    <span className="text-xs text-foreground/60">Your Google API key for authentication.</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter your API Key" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
            <Button
              disabled={appState === "loading"}
              type="button"
              onClick={() => setState(false)}
              variant={"outline"}
              size={"sm"}
              className="w-full sm:w-fit">
              Close
            </Button>
            <div className="flex justify-center items-center gap-4">
              <Button
                disabled={appState === "loading"}
                type="submit"
                variant={"default"}
                size={"sm"}
                className="w-full sm:w-fit">
                {appState === "loading" && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
                Save Integration
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
const ManageSlack = ({ setState, integration }: { setState: TSetState<boolean>; integration: EIntegration }) => {
  const supabase = createClient();
  const { integrations, setIntegrations } = useFormStore();
  const [appState, setAppState] = useState<TAppState>("idle");
  const [active, setActive] = useState(integration.active);

  const formSchema = z.object({
    webhookUrl: z.string().min(1, "Webhook URL is required"),
    channel: z.string().min(1, "Channel is required"),
    botName: z.string().min(1, "Bot name is required"),
    iconEmoji: z.string().min(1, "Icon emoji is required"),
  });
  const formHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: integration.slack_webhook_url ?? "",
      channel: integration.slack_channel ?? "",
      botName: integration.slack_bot_name ?? "",
      iconEmoji: integration.slack_bot_icon_emoji ?? "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setAppState("loading");
    const { botName, channel, iconEmoji, webhookUrl } = values;
    const { data, error } = await supabase
      .from("integrations")
      .update({
        slack_webhook_url: webhookUrl,
        slack_bot_name: botName,
        slack_channel: channel,
        slack_bot_icon_emoji: iconEmoji,
        active,
      })
      .eq("id", integration.id)
      .select()
      .single();

    if (error) {
      toast.error("Error on updating integration, please try again.");
      setAppState("idle");
      return;
    }

    const updatedIntegrations = integrations.map((old) => {
      return old.id === data.id ? data : old;
    });
    setIntegrations(updatedIntegrations);
    setState(false);
    toast.success("Integration updated.");
    setAppState("idle");
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <Badge variant={"primary"} uppercase>
          Slack
        </Badge>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>
      <Form {...formHandler}>
        <form onSubmit={formHandler.handleSubmit(onSubmit)} className="flex flex-col overflow-y-auto gap-4">
          <div className="h-full flex flex-col gap-8 overflow-y-auto  ">
            <FormField
              control={formHandler.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Slack Webhook URL</FormLabel>
                    <span className="text-xs text-foreground/60">The webhook URL for sending messages to Slack.</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter your Webhook URL" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="channel"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Slack Channel</FormLabel>
                    <span className="text-xs text-foreground/60">The Slack channel where messages will be sent.</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter the Channel Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="botName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Bot Name</FormLabel>
                    <span className="text-xs text-foreground/60">The display name for your bot in Slack.</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter Bot Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formHandler.control}
              name="iconEmoji"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Bot Icon Emoji</FormLabel>
                    <span className="text-xs text-foreground/60">
                      The emoji to use as the bot&apos;s icon (e.g., :robot_face:).
                    </span>
                  </div>
                  <FormControl>
                    <Input placeholder="Enter Emoji Code" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4">
            <Button
              type="button"
              onClick={() => setState(false)}
              variant={"outline"}
              size={"sm"}
              className="w-full sm:w-fit">
              Close
            </Button>
            <div className="flex justify-center items-center gap-4">
              <Button type="submit" variant={"default"} size={"sm"} className="w-full sm:w-fit">
                {appState === "loading" && <Loader2Icon className="animate-spin w-4 h-4 mr-2" />}
                Save Integration
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormManageIntegration;
