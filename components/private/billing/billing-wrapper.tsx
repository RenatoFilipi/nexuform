"use client";

import useUserStore from "@/stores/user";
import { EProfile, ESubscription } from "@/utils/entities";
import { IPlan } from "@/utils/interfaces";
import { getPlans } from "@/utils/plans";
import { useQuery } from "@tanstack/react-query";
import BillingUsage from "./billing-usage";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  formsCount: number;
  submissionsCount: number;
}

const BillingWrapper = (props: IProps) => {
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["billingData"],
    queryFn: async () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setFormsCount(props.formsCount);
      user.setSubmissionsCount(props.submissionsCount);
      const plans: IPlan[] = (await getPlans(props.locale)).filter((x) => x.type !== "free_trial");
      return { plans };
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-52 py-4 sm:py-8">
      <div className="flex justify-center items-center gap-8">
        <BillingUsage />
      </div>
    </div>
  );
};

export default BillingWrapper;
