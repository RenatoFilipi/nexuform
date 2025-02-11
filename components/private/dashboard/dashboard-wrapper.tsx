"use client";

import { Button } from "@/components/ui/button";
import useFormsStore from "@/stores/forms";
import useUserStore from "@/stores/user";
import { planSettings } from "@/utils/constants";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import ChangePlans from "../core/change-plans";
import DashboardForms from "./dashboard-forms";
import FormCreate from "./form-create";

const DashboardWrapper = ({
  forms,
  profile,
  subscription,
}: {
  forms: EForm[];
  profile: EProfile;
  subscription: ESubscription;
}) => {
  const {
    setProfile,
    setSubscription,
    setFormsQty,
    formsQty,
    subscription: { plan },
  } = useUserStore();
  const { setForms } = useFormsStore();
  const mustUpgrade =
    (formsQty >= planSettings.freeTrial.forms && plan === "free_trial") ||
    (formsQty >= planSettings.basic.forms && plan === "basic") ||
    (formsQty >= planSettings.pro.forms && plan === "pro");

  const query = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => {
      setForms(forms);
      setFormsQty(forms.length);
      setProfile(profile);
      setSubscription(subscription);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Forms</h1>
        <div className="flex justify-center items-center gap-4">
          {mustUpgrade ? (
            <ChangePlans>
              <Button size={"sm"} variant={"default"}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Form
              </Button>
            </ChangePlans>
          ) : (
            <FormCreate userId={profile.id}>
              <Button size={"sm"} variant={"default"}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Form
              </Button>
            </FormCreate>
          )}
        </div>
      </div>
      <DashboardForms />
    </div>
  );
};

export default DashboardWrapper;
