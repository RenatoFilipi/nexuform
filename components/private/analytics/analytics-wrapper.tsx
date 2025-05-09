"use client";

import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubmissionLog, ESubscription, EViewLog } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import AnalyticsOverview from "./analytics-overview";
import AnalyticsSubmissionsActivityChart from "./analytics-submissions-activity-chart";
import AnalyticsSubmissionsByFormChart from "./analytics-submissions-by-form-chart";

interface Props {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  forms: EForm[];
}

const AnalyticsWrapper = ({ profile, subscription, email, viewLogs, submissionLogs, forms }: Props) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const global = useGlobalStore();

  const query = useQuery({
    queryKey: ["analyticsData"],
    queryFn: () => {
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setEmail(email);
      global.setSubmissionLogs(submissionLogs);
      global.setViewLogs(viewLogs);
      global.setForms(forms);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col px-3 sm:px-20 lg:px-52 gap-6 py-4 sm:py-8">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-xl font-medium">{t("label_analytics")}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="">
          <AnalyticsOverview />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <AnalyticsSubmissionsByFormChart />
          <AnalyticsSubmissionsActivityChart />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWrapper;
