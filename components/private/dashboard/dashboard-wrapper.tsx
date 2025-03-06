"use client";

import { Button } from "@/components/ui/button";
import useFormsStore from "@/stores/forms";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { getCurrentPlan } from "@/utils/functions";
import { TPlan } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import ManageSubscription from "../shared/manage-subscription";
import DashboardForms from "./dashboard-forms";
import DashboardNewForm from "./dashboard-new-form";

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
    <div className="flex-1 mt-12 flex flex-col gap-6 px-3 sm:px-20 lg:px-52 py-4 sm:py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Forms</h1>
        <div className="flex justify-center items-center gap-4">
          {mustUpgrade ? (
            <ManageSubscription>
              <Button size={"sm"} variant={"secondary"}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </ManageSubscription>
          ) : (
            <DashboardNewForm userId={profile.id}>
              <Button size={"sm"} variant={"secondary"}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </DashboardNewForm>
          )}
        </div>
      </div>
      <DashboardForms />
    </div>
  );
};

export default DashboardWrapper;
