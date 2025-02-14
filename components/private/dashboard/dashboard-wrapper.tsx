"use client";

import { Button } from "@/components/ui/button";
import useFormsStore from "@/stores/forms";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { getCurrentPlan } from "@/utils/functions";
import { TPlan } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import ChangePlans from "../core/change-plans";
import DashboardForms from "./dashboard-forms";
import FormCreate from "./form-create";

const DashboardWrapper = ({
  forms,
  profile,
  subscription,
  email,
}: {
  forms: EForm[];
  profile: EProfile;
  subscription: ESubscription;
  email: string;
}) => {
  const user = useUserStore();
  const { setForms } = useFormsStore();
  const currentPlan = getCurrentPlan(subscription.plan as TPlan);
  const mustUpgrade = user.formsCount >= currentPlan.forms;

  const query = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => {
      setForms(forms);
      user.setFormsCount(forms.length);
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setEmail(email);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 lg:px-36 sm:px-6 flex-1 mt-14">
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
