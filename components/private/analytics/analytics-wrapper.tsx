"use client";

import useAnalyticsStore from "@/stores/analytics";
import useUserStore from "@/stores/user";
import { EForm, EFormAnalytics, EProfile, ESubmission, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import AnalyticsOverview from "./analytics-overview";
import AnalyticsSubmissionsActivityChart from "./analytics-submissions-activity-chart";
import AnalyticsSubmissionsByFormChart from "./analytics-submissions-by-form-chart";

interface Props {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  forms: EForm[];
  formsAnalytics: EFormAnalytics[];
  submissions: ESubmission[];
}

const AnalyticsWrapper = ({ forms, formsAnalytics, profile, subscription, email, submissions }: Props) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const analytics = useAnalyticsStore();

  const query = useQuery({
    queryKey: ["analyticsData"],
    queryFn: () => {
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setEmail(email);
      analytics.setForms(forms);
      analytics.setFormAnalytics(formsAnalytics);
      analytics.setSubmissions(submissions);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col px-3 sm:px-20 lg:px-52 gap-6 py-4 sm:py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">{t("label_analytics")}</h1>
      </div>
      <div className="grid gap-6">
        <AnalyticsOverview />
        <div className="grid sm:grid-cols-2 gap-6">
          <AnalyticsSubmissionsByFormChart />
          <AnalyticsSubmissionsActivityChart />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWrapper;
