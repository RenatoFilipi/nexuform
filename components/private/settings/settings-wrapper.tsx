"use client";

import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { CreditCardIcon, KeyRoundIcon, UserIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import SettingsAccount from "./settings-account";
import SettingsBilling from "./settings-billing";
import SettingsPassword from "./settings-password";

type TView = "account" | "billing" | "password";

const views = [
  {
    label: "Account",
    icon: UserIcon,
    view: "account",
    enabled: true,
  },
  {
    label: "Billing & Usage",
    icon: CreditCardIcon,
    view: "billing",
    enabled: true,
  },
  {
    label: "Password",
    icon: KeyRoundIcon,
    view: "password",
    enabled: true,
  },
];

const SettingsWrapper = ({
  profile,
  subscription,
  formsCount,
  submissionsCount,
  email,
}: {
  profile: EProfile;
  subscription: ESubscription;
  formsCount: number;
  submissionsCount: number;
  email: string;
}) => {
  const [resource] = useQueryState("resource");
  const [view, setView] = useState<TView>("account");
  const enabledViews = views.filter((x) => x.enabled);
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["settingsData"],
    queryFn: () => {
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setFormsCount(formsCount);
      user.setSubmissionsCount(submissionsCount);
      user.setEmail(email);
      if (resource && resource === "update-password") setView("password");
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 flex flex-col">
      <div className="border-b h-10 flex justify-start items-center gap-1 px-2 sm:px-6 overflow-x-auto">
        {enabledViews.map((v) => {
          return (
            <button
              onClick={() => setView(v.view as TView)}
              key={v.view}
              className={`${
                v.view === view ? "font-medium text-foreground" : "text-foreground/60"
              } text-xs flex justify-center items-center px-2 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
              <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/60"} w-4 h-4`} />
              {v.label}
              {v.view === view && <div className="bg-foreground/70 bottom-0 w-full h-0.5 absolute"></div>}
            </button>
          );
        })}
      </div>
      <div className="px-3 sm:px-20 lg:px-72 pt-8 flex justify-center flex-1 items-start overflow-y-auto">
        {view === "account" && <SettingsAccount />}
        {view === "billing" && <SettingsBilling />}
        {view === "password" && <SettingsPassword />}
      </div>
    </div>
  );
};

export default SettingsWrapper;
