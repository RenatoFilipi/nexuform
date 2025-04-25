"use client";

import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import SettingsAccount from "./settings-account";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  formsCount: number;
  email: string;
  locale: string;
}

const SettingsWrapper = ({ profile, subscription, formsCount, email, locale }: IProps) => {
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["settingsData"],
    queryFn: () => {
      user.setLocale(locale);
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setFormsCount(formsCount);
      user.setEmail(email);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col">
      <div className="px-3 sm:px-20 lg:px-72 pt-8 flex justify-center flex-1 items-start overflow-y-auto">
        <SettingsAccount />
      </div>
    </div>
  );
};

export default SettingsWrapper;
