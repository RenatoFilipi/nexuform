"use client";

import useSettingsStore from "@/stores/settings";
import { EProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { CreditCardIcon, Layers2Icon } from "lucide-react";
import { useState } from "react";
import SettingsBilling from "./settings-billing";
import SettingsGeneral from "./settings-general";

type TView = "general" | "billing";

const views = [
  { label: "General", icon: Layers2Icon, view: "general", enabled: true },
  { label: "Billing", icon: CreditCardIcon, view: "billing", enabled: true },
];

const SettingsWrapper = ({ profile }: { profile: EProfile }) => {
  const [view, setView] = useState<TView>("general");
  const enabledViews = views.filter((x) => x.enabled);
  const { setProfile } = useSettingsStore();

  const query = useQuery({
    queryKey: ["settingsData"],
    queryFn: () => {
      setProfile(profile);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex w-full h-full flex-1 relative sm:pl-36">
      <div className="flex flex-col h-fit sm:w-60 gap-1 fixed">
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
  );
};

export default SettingsWrapper;
