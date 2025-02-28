"use client";

import useAnalyticsStore from "@/stores/analytics";
import useUserStore from "@/stores/user";
import { EForm, EFormAnalytics, EProfile, ESubmission, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import AnalyticsOverview from "./analytics-overview";
import AnalyticsSubmissionsActivityChart from "./analytics-submissions-activity-chart";

interface Props {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  forms: EForm[];
  formsAnalytics: EFormAnalytics[];
  submissions: ESubmission[];
}

const AnalyticsWrapper = ({ forms, formsAnalytics, profile, subscription, email, submissions }: Props) => {
  const userStore = useUserStore();
  const analyticsStore = useAnalyticsStore();
  const query = useQuery({
    queryKey: ["analyticsData"],
    queryFn: () => {
      userStore.setProfile(profile);
      userStore.setSubscription(subscription);
      userStore.setEmail(email);
      analyticsStore.setForms(forms);
      analyticsStore.setFormAnalytics(formsAnalytics);
      analyticsStore.setSubmissions(submissions);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 lg:px-36 sm:px-6 flex-1 mt-14">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Analytics</h1>
      </div>
      <div className="grid gap-6">
        <AnalyticsOverview />
        <AnalyticsSubmissionsActivityChart />
      </div>
    </div>
  );
};

export default AnalyticsWrapper;
