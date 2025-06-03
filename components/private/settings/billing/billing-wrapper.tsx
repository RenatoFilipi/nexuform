"use client";

import useUserStore from "@/stores/user";
import { EProfile, ESubmissionLog, ESubscription } from "@/utils/entities";
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
  submissionLogs: ESubmissionLog[];
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
      user.setSubmissionLogs(props.submissionLogs);
      const plans: IPlan[] = (await getPlans(props.locale)).filter((x) => x.type !== "free_trial");
      return { plans };
    },
  });

  if (query.isPending) return null;

  return <BillingUsage />;
};

export default BillingWrapper;
