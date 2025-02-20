import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { minWidth640 } from "@/utils/constants";
import { TAppState, TIntegrations, TSetState } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const FormInstallIntegration = ({
  children,
  integration,
}: {
  children: React.ReactNode;
  integration: TIntegrations;
}) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Integration</DialogTitle>
            <DialogDescription>Install and configure third-party integrations for your form.</DialogDescription>
          </DialogHeader>
          {integration === "google_sheets" && <InstallGoogleSheets setState={setOpen} />}
          {integration === "slack" && <InstallSlack setState={setOpen} />}
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
          <DrawerDescription>Install and configure third-party integrations for your form.</DrawerDescription>
        </DrawerHeader>
        {integration === "google_sheets" && <InstallGoogleSheets setState={setOpen} />}
        {integration === "slack" && <InstallSlack setState={setOpen} />}
      </DrawerContent>
    </Drawer>
  );
};

const InstallGoogleSheets = ({ setState }: { setState: TSetState<boolean> }) => {
  const [appState, setAppState] = useState<TAppState>("idle");

  const formSchema = z.object({
    sheetId: z.string().min(1, "Sheet ID is required"),
    sheetName: z.string().min(1, "Sheet name is required"),
    range: z.string().optional(),
    apiKey: z.string().min(1, "API key is required"),
  });

  const formHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheetId: "",
      sheetName: "",
      range: "",
      apiKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <Badge variant={"primary"} uppercase>
          Google Sheets
        </Badge>
      </div>
      <Form {...formHandler}>
        <form onSubmit={formHandler.handleSubmit(onSubmit)} className="flex flex-col overflow-y-auto gap-4">
          <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
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
              name="sheetName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <div className="grid gap-1">
                    <FormLabel>Data Range</FormLabel>
                    <span className="text-xs text-foreground/60">Specify the cell range, e.g., A1:C10.</span>
                  </div>
                  <FormControl>
                    <Input placeholder="Example: A1:C10" {...field} />
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
          <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
            <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
              Close
            </Button>
            <Button variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
              Install Integration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
const InstallSlack = ({ setState }: { setState: TSetState<boolean> }) => {
  const formSchema = z.object({
    webhookUrl: z.string().min(1, "Webhook URL is required"),
    channel: z.string().min(1, "Channel is required"),
    botName: z.string().min(1, "Bot Name is required"),
    iconEmoji: z.string().min(1, "Icon Emoji is required"),
  });

  const formHandler = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: "",
      channel: "",
      botName: "",
      iconEmoji: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setState(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <Badge variant={"primary"} uppercase>
          Slack
        </Badge>
      </div>
      <Form {...formHandler}>
        <form onSubmit={formHandler.handleSubmit(onSubmit)} className="flex flex-col overflow-y-auto gap-4">
          <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
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
          <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
            <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
              Close
            </Button>
            <Button variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
              Install Integration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormInstallIntegration;
