"use client";

import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { CreditCardIcon, Layers2Icon } from "lucide-react";
import { useState } from "react";
import SettingsBilling from "./settings-billing";
import SettingsGeneral from "./settings-general";

type TView = "general" | "billing";

const views = [
  { label: "General", icon: Layers2Icon, view: "general", enabled: true },
  {
    label: "Billing",
    icon: CreditCardIcon,
    view: "billing",
    enabled: true,
  },
];

const SettingsWrapper = ({
  profile,
  subscription,
}: {
  profile: EProfile;
  subscription: ESubscription;
}) => {
  const [view, setView] = useState<TView>("general");
  const enabledViews = views.filter((x) => x.enabled);
  const { setProfile, setSubscription } = useUserStore();

  const query = useQuery({
    queryKey: ["settingsData"],
    queryFn: () => {
      setProfile(profile);
      setSubscription(subscription);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex w-full h-full flex-1 relative sm:pl-36 flex-col sm:flex-row gap-4 sm:gap-0">
        <div className="flex sm:flex-col h-fit sm:w-60 gap-1 sm:fixed">
          {enabledViews.map((v) => (
            <button
              key={v.view}
              onClick={() => setView(v.view as TView)}
              className={`${
                v.view === view ? "border-foreground/30" : "border-transparent"
              } border p-2 flex items-center justify-start gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
              <v.icon
                className={`${
                  v.view === view ? "text-primary" : "text-foreground"
                } w-4 h-4`}
              />
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex w-full sm:ml-72 sm:pr-40">
          {view === "general" && <SettingsGeneral />}
          {view === "billing" && <SettingsBilling />}
        </div>
      </div>
    </div>
  );
};

export default SettingsWrapper;
