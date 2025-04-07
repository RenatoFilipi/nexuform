import { Button } from "@/components/ui/button";
import useDashboardStore from "@/stores/dashboard";
import useUserStore from "@/stores/user";
import { getCurrentPlan } from "@/utils/functions";
import { TPlan } from "@/utils/types";
import { LayersIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ManageSubscription from "../shared/manage-subscription";
import DashboardFormCard from "./dashboard-form-card";
import DashboardNewForm from "./dashboard-new-form";

const DashboardForms = () => {
  const t = useTranslations("app");
  const user = useUserStore();
  const dashboard = useDashboardStore();
  const currentPlan = getCurrentPlan(user.subscription.plan as TPlan);
  const mustUpgrade = user.formsCount >= currentPlan.forms;
  const empty = dashboard.forms.length <= 0;

  if (empty) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-4">
        <div className="border pb-20 flex flex-col justify-center items-center gap-6 border-none">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">
              <LayersIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex justify-center items-center flex-col">
              <span className="text-lg font-medium">{t("label_no_forms")}</span>
              <span className="text-sm text-center text-foreground/70">{t("desc_no_forms")}</span>
            </div>
            <div className="flex w-full justify-center items-center mt-2">
              {mustUpgrade && (
                <ManageSubscription>
                  <Button size={"sm"} variant={"secondary"}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t("label_create_form")}
                  </Button>
                </ManageSubscription>
              )}
              {!mustUpgrade && (
                <DashboardNewForm>
                  <Button size={"sm"} variant={"secondary"}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t("label_create_form")}
                  </Button>
                </DashboardNewForm>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {dashboard.forms.map((form) => (
        <DashboardFormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default DashboardForms;
