import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { IIntegration } from "@/utils/interfaces";
import { BirdIcon, PlugIcon } from "lucide-react";
import ChangePlans from "../core/change-plans";
import ManageIntegration from "./manage-integration";

const integrations: IIntegration[] = [
  {
    name: "Google Sheets",
    type: "google_sheets",
    icon: (
      <svg className="w-6 h-6" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Google Sheets</title>
        <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
      </svg>
    ),
    enabled: true,
    description: "Connect with Google Sheets to automate data export directly to your spreadsheets.",
    pro: false,
  },
  {
    name: "Zapier",
    type: "zapier",
    icon: (
      <svg className="w-6 h-6" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Zapier</title>
        <path d="M4.157 0A4.151 4.151 0 0 0 0 4.161v15.678A4.151 4.151 0 0 0 4.157 24h15.682A4.152 4.152 0 0 0 24 19.839V4.161A4.152 4.152 0 0 0 19.839 0H4.157Zm10.61 8.761h.03a.577.577 0 0 1 .23.038.585.585 0 0 1 .201.124.63.63 0 0 1 .162.431.612.612 0 0 1-.162.435.58.58 0 0 1-.201.128.58.58 0 0 1-.23.042.529.529 0 0 1-.235-.042.585.585 0 0 1-.332-.328.559.559 0 0 1-.038-.235.613.613 0 0 1 .17-.431.59.59 0 0 1 .405-.162Z" />
      </svg>
    ),
    enabled: false,
    description: "Automate workflows by connecting different apps and services without writing code.",
    pro: true,
  },
  {
    name: "Slack",
    type: "slack",
    icon: (
      <svg className="w-6 h-6" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Slack</title>
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
      </svg>
    ),
    enabled: true,
    description: "Stay connected with real-time notifications and seamless communication through Slack.",
    pro: true,
  },
];

const FormIntegrations = () => {
  const enabledIntegrations = integrations.filter((x) => x.enabled);

  return (
    <div className="p-6 flex flex-col gap-6 w-full">
      <div>
        <h2 className="font-semibold text-lg">Available Integrations</h2>
        <p className="text-sm text-foreground/70">
          Connect with powerful tools to automate workflows, improve collaboration, and enhance productivity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enabledIntegrations.map((integration) => (
          <CardTemplate key={integration.type} integration={integration} />
        ))}
      </div>
    </div>
  );
};

const CardTemplate = ({ integration }: { integration: IIntegration }) => {
  const user = useUserStore();

  return (
    <div className="flex flex-col items-center justify-start p-4 gap-4 border rounded-lg shadow-sm bg-background">
      <div className="flex items-center gap-3 w-full justify-between">
        <div className="flex justify-start items-center gap-2">
          <span className="font-medium">{integration.name}</span>
        </div>
        {integration.pro && (
          <Badge variant={"pink"} uppercase>
            Pro
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm text-foreground/70">{integration.description}</p>
      </div>
      <div className="flex justify-start w-full">
        {user.subscription.plan !== "pro" && integration.pro ? (
          <ChangePlans>
            <Button size="sm" variant="outline">
              <BirdIcon className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </ChangePlans>
        ) : (
          <ManageIntegration integration={integration.type}>
            <Button size="sm" variant="outline">
              <PlugIcon className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </ManageIntegration>
        )}
      </div>
    </div>
  );
};

export default FormIntegrations;
