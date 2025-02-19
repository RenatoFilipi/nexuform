import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user";
import { integrations } from "@/utils/constants";
import { IIntegration } from "@/utils/interfaces";
import { BirdIcon, PlugIcon } from "lucide-react";
import ManageSubscription from "../shared/manage-subscription";
import FormManageIntegration from "./form-manage-integration";

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
          <ManageSubscription>
            <Button size="sm" variant="outline">
              <BirdIcon className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </ManageSubscription>
        ) : (
          <FormManageIntegration integration={integration.type}>
            <Button size="sm" variant="outline">
              <PlugIcon className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </FormManageIntegration>
        )}
      </div>
    </div>
  );
};

export default FormIntegrations;
