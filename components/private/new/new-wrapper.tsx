"use client";

import useDashboardStore from "@/stores/dashboard";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import NewCustom from "./new-custom";
import NewTemplates from "./new-templates";

interface IProps {
  forms: EForm[];
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
}

const NewWrapper = ({ forms, profile, subscription, email, locale }: IProps) => {
  const user = useUserStore();
  const dashboard = useDashboardStore();
  const [error] = useQueryState("error");

  const query = useQuery({
    queryKey: ["newData"],
    queryFn: () => {
      user.setLocale(locale);
      user.setEmail(email);
      user.setProfile(profile);
      user.setSubscription(subscription);
      dashboard.setForms(forms);
      return null;
    },
    refetchOnWindowFocus: false,
  });
  useQuery({
    queryKey: [error],
    queryFn: () => {
      if (error !== null) {
        toast.error(error);
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-52 py-4 sm:py-8">
      <div className="flex flex-col gap-8">
        <NewCustom />
        <NewTemplates />
      </div>
    </div>
  );
};

export default NewWrapper;
