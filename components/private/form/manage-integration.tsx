import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { minWidth640 } from "@/utils/constants";
import { TIntegrations, TSetState } from "@/utils/types";
import { useState } from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../ui/drawer";

const ManageIntegration = ({ children, integration }: { children: React.ReactNode; integration: TIntegrations }) => {
  const isDesktop = useMedia(minWidth640);
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col min-w-[650px] h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Integration</DialogTitle>
            <DialogDescription>Manage and configure third-party integrations for your form.</DialogDescription>
          </DialogHeader>
          {integration === "google_sheets" && <ManageGoogleSheets setState={setOpen} />}
          {integration === "slack" && <ManageSlack setState={setOpen} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="p-3 flex flex-col gap-8">
        <DrawerHeader>
          <DrawerTitle>Integration</DrawerTitle>
          <DrawerDescription>Manage and configure third-party integrations for your form.</DrawerDescription>
        </DrawerHeader>
        {integration === "google_sheets" && <ManageGoogleSheets setState={setOpen} />}
        {integration === "slack" && <ManageSlack setState={setOpen} />}
      </DrawerContent>
    </Drawer>
  );
};

const ManageGoogleSheets = ({ setState }: { setState: TSetState<boolean> }) => {
  const [sheetId, setSheetId] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [range, setRange] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    console.log({ sheetId, sheetName, range, apiKey });
    setState(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <Badge variant={"primary"} uppercase>
          Google Sheets
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="sheet-id">Google Sheet ID</Label>
            <span className="text-xs text-foreground/60">The unique ID of your Google Sheet.</span>
          </div>
          <Input
            id="sheet-id"
            placeholder="Enter your Sheet ID"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="sheet-name">Sheet Name</Label>
            <span className="text-xs text-foreground/60">The name of the specific sheet within the document.</span>
          </div>
          <Input
            id="sheet-name"
            placeholder="Enter the Sheet Name"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="range">Data Range (Optional)</Label>
            <span className="text-xs text-foreground/60">
              Specify the cell range, e.g., A1:C10. Leave empty for the entire sheet.
            </span>
          </div>
          <Input id="range" placeholder="Example: A1:C10" value={range} onChange={(e) => setRange(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="api-key">Google API Key</Label>
            <span className="text-xs text-foreground/60">Your Google API key for authentication.</span>
          </div>
          <Input
            id="api-key"
            placeholder="Enter your API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
        <Button
          onClick={() => {
            handleSave();
          }}
          variant={"secondary"}
          size={"sm"}
          className="w-full sm:w-fit">
          Save Integration
        </Button>
      </div>
    </div>
  );
};
const ManageSlack = ({ setState }: { setState: TSetState<boolean> }) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [channel, setChannel] = useState("");
  const [botName, setBotName] = useState("");
  const [iconEmoji, setIconEmoji] = useState("");

  const handleSave = () => {
    console.log({ webhookUrl, channel, botName, iconEmoji });
    setState(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <Badge variant={"primary"} uppercase>
          Slack
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-8 overflow-y-auto pr-4">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="webhook-url">Slack Webhook URL</Label>
            <span className="text-xs text-foreground/60">The webhook URL for sending messages to Slack.</span>
          </div>
          <Input
            id="webhook-url"
            placeholder="Enter your Webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="channel">Slack Channel</Label>
            <span className="text-xs text-foreground/60">The Slack channel where messages will be sent.</span>
          </div>
          <Input
            id="channel"
            placeholder="Enter the Channel Name"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="bot-name">Bot Name</Label>
            <span className="text-xs text-foreground/60">The display name for your bot in Slack.</span>
          </div>
          <Input
            id="bot-name"
            placeholder="Enter Bot Name"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="icon-emoji">Bot Icon Emoji</Label>
            <span className="text-xs text-foreground/60">The emoji to use as the bot's icon (e.g., :robot_face:).</span>
          </div>
          <Input
            id="icon-emoji"
            placeholder="Enter Emoji Code"
            value={iconEmoji}
            onChange={(e) => setIconEmoji(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
        <Button onClick={handleSave} variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
          Save Integration
        </Button>
      </div>
    </div>
  );
};
const ManageWebhook = ({ setState }: { setState: TSetState<boolean> }) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");

  const handleSave = () => {
    console.log({ webhookUrl, method, headers, body });
    setState(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <Badge variant={"primary"} uppercase>
          Webhook Integration
        </Badge>
      </div>
      <div className="h-full flex flex-col gap-8 overflow-y-auto">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <span className="text-xs text-foreground/60">The URL where webhook requests will be sent.</span>
          </div>
          <Input
            id="webhook-url"
            placeholder="Enter Webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="method">HTTP Method</Label>
            <span className="text-xs text-foreground/60">Select the HTTP method for the request.</span>
          </div>
          <select id="method" value={method} onChange={(e) => setMethod(e.target.value)} className="input">
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="headers">Headers (JSON format)</Label>
            <span className="text-xs text-foreground/60">Optional HTTP headers for the request.</span>
          </div>
          <textarea
            id="headers"
            placeholder="Enter headers in JSON format"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="input"
          />
        </div>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="body">Request Body (JSON format)</Label>
            <span className="text-xs text-foreground/60">Optional request body for POST and PUT requests.</span>
          </div>
          <textarea
            id="body"
            placeholder="Enter body in JSON format"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center flex-col sm:flex-row">
        <Button onClick={() => setState(false)} variant={"outline"} size={"sm"} className="w-full sm:w-fit">
          Close
        </Button>
        <Button onClick={handleSave} variant={"secondary"} size={"sm"} className="w-full sm:w-fit">
          Save Integration
        </Button>
      </div>
    </div>
  );
};

export default ManageIntegration;
