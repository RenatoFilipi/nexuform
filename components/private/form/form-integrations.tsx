import IntegrationStatusBadge from "@/components/shared/integration-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { integrations } from "@/utils/constants";
import { EIntegration } from "@/utils/entities";
import { getIntegrationCategory, getIntegrationName } from "@/utils/functions";
import { IIntegration } from "@/utils/interfaces";
import { TIntegrations, TSetState } from "@/utils/types";
import { BirdIcon, CheckIcon, CogIcon, PlusIcon, RocketIcon, ShieldAlertIcon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ManageSubscription from "../shared/manage-subscription";
import FormDeleteIntegration from "./form-delete-integration";
import FormInstallIntegration from "./form-install-integration";
import FormManageIntegration from "./form-manage-integration";

type TView = "installed" | "marketplace";

const views = [
  { label: "Installed", icon: ZapIcon, view: "installed", enabled: true },
  { label: "Marketplace", icon: PlusIcon, view: "marketplace", enabled: true },
];
const FormIntegrations = () => {
  const t = useTranslations("app");
  const [view, setView] = useState<TView>("installed");
  const enabledViews = views.filter((x) => x.enabled);

  return (
    <div className="flex justify-center items-center w-full mt-20">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
          <RocketIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center flex flex-col justify-center items-center gap-1">
          <h2 className="text-base font-medium">{t("label_coming_soon")}</h2>
          <p className="text-xs text-foreground/80">{t("desc_coming_soon")}</p>
        </div>
      </div>
    </div>
  );

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
              } border p-2 flex items-center justify-center sm:justify-start gap-2 text-sm hover:bg-foreground/5 rounded flex-1 `}>
              <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
              {v.label}
            </button>
          );
        })}
      </div>
      <div className="flex w-full sm:ml-64">
        {view === "installed" && <InstalledIntegrations setState={setView} />}
        {view === "marketplace" && <MarketplaceIntegrations />}
      </div>
    </div>
  );
};
const InstalledIntegrations = ({ setState }: { setState: TSetState<TView> }) => {
  const { integrations } = useFormStore();
  const empty = integrations.length <= 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="font-semibold text-base">Installed Integrations</h2>
        <p className="text-xs text-foreground/70">
          Manage and configure your connected integrations to enhance your workflow.
        </p>
      </div>
      {empty && (
        <div className="flex justify-center items-center w-full mt-10">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center p-2 w-fit rounded bg-primary/10">
              <ZapIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center flex flex-col justify-center items-center gap-1">
              <h2 className="text-lg font-medium">No integrations installed</h2>
              <p className="text-sm text-foreground/70">Explore the marketplace to find and install an integration.</p>
            </div>
            <div className="flex justify-center items-center w-fit">
              <Button onClick={() => setState("marketplace")} variant={"outline"} size={"xs"}>
                Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      )}
      {!empty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            return <InstalledIntegrationCard key={integration.id} integration={integration} />;
          })}
        </div>
      )}
    </div>
  );
};
const MarketplaceIntegrations = () => {
  const enabledIntegrations = integrations.filter((x) => x.enabled);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="font-semibold text-base">Available Integrations</h2>
        <p className="text-xs text-foreground/70">
          Connect with powerful tools to automate workflows, improve collaboration, and enhance productivity.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {enabledIntegrations.map((integration) => (
          <IntegrationMarketPlaceCard key={integration.type} integration={integration} />
        ))}
      </div>
    </div>
  );
};
const IntegrationMarketPlaceCard = ({ integration }: { integration: IIntegration }) => {
  const user = useUserStore();
  const form = useFormStore();
  const installed = form.integrations.find((x) => x.type == integration.type);

  return (
    <div className="flex flex-col items-center justify-between p-4 gap-4 border rounded-lg shadow-sm bg-background">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3 w-full justify-between">
          <div className="flex justify-start items-center gap-2">
            <span className="font-medium">{integration.name}</span>
            {integration.pro && (
              <Badge variant={"pink"} uppercase>
                Pro
              </Badge>
            )}
          </div>
          <div className="flex justify-center items-center gap-3">
            <Badge variant={"info"} uppercase>
              {getIntegrationCategory(integration.category)}
            </Badge>
          </div>
        </div>
        <div className="flex justify-start items-center w-full">
          <p className="text-sm text-start text-foreground/70">{integration.description}</p>
        </div>
      </div>
      <div className="flex justify-end w-full">
        {user.subscription.plan !== "pro" && integration.pro ? (
          <ManageSubscription>
            <Button size="sm" variant="outline">
              <BirdIcon className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </ManageSubscription>
        ) : (
          <div>
            {installed ? (
              <Badge variant={"success"}>
                <CheckIcon className="w-4 h-4 mr-2" />
                Installed
              </Badge>
            ) : (
              <FormInstallIntegration integration={integration.type}>
                <Button size="sm" variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Install
                </Button>
              </FormInstallIntegration>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const InstalledIntegrationCard = ({ integration }: { integration: EIntegration }) => {
  return (
    <div className="flex items-center justify-between border rounded-lg shadow-sm bg-background py-3 px-4 flex-col gap-6">
      <div className="flex justify-between items-center w-full">
        <span className="text-sm font-medium">{getIntegrationName(integration.type as TIntegrations)}</span>
        <IntegrationStatusBadge active={integration.active} />
      </div>
      <div className="flex justify-end items-center gap-3 w-full">
        <FormManageIntegration integration={integration}>
          <Button variant={"outline"} size={"sm"}>
            <CogIcon className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </FormManageIntegration>
        <FormDeleteIntegration integration={integration}>
          <Button variant={"outline"} size={"sm"}>
            <ShieldAlertIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </FormDeleteIntegration>
      </div>
    </div>
  );
};

export default FormIntegrations;
