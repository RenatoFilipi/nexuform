"use client";

import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EForm, EProfile, ESubmissionLog, ESubscription, EViewLog } from "@/utils/entities";
import { getDateRangeFromToday } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import DateRangePicker from "../shared/core/date-range-picker";
import AnalyticsOverview from "./analytics-overview";
import AnalyticsSubmissionsActivityChart from "./analytics-submissions-activity-chart";
import AnalyticsSubmissionsByFormChart from "./analytics-submissions-by-form-chart";

interface Props {
  email: string;
  profile: EProfile;
  subscription: ESubscription;
  locale: string;
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
  forms: EForm[];
}

const AnalyticsWrapper = ({ profile, subscription, email, viewLogs, submissionLogs, forms, locale }: Props) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const global = useGlobalStore();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["analytics-data"],
    queryFn: () => {
      const dates = getDateRangeFromToday(7);
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setEmail(email);
      user.setLocale(locale);
      global.setSubmissionLogs(submissionLogs);
      global.setViewLogs(viewLogs);
      global.setForms(forms);
      global.setFrom(dates.startDate);
      global.setTo(dates.endDate);
      return null;
    },
  });

  const onSelectRange = async (from: string, to: string) => {
    const fromD = new Date(from);
    const toD = new Date(to);
    global.setFrom(fromD);
    global.setTo(toD);

    const ids = global.forms.map((x) => x.id);
    console.log(ids);

    const submissionLogs = await supabase
      .from("submission_logs")
      .select("*")
      .in("form_id", ids)
      .gte("created_at", fromD.toISOString())
      .lte("created_at", toD.toISOString());

    const viewLogs = await supabase
      .from("view_logs")
      .select("*")
      .in("form_id", ids)
      .gte("created_at", fromD.toISOString())
      .lte("created_at", toD.toISOString());

    if (!submissionLogs.error) global.setSubmissionLogs(submissionLogs.data);
    if (!viewLogs.error) global.setViewLogs(viewLogs.data);
  };

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col px-3 sm:px-20 lg:px-52 gap-6 py-4 sm:py-8">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-xl font-medium">{t("label_analytics")}</h1>
        <DateRangePicker
          initialRange={{
            from: global.from.toISOString(),
            to: global.to.toISOString(),
          }}
          onChange={(range) => {
            if (!range) return;
            onSelectRange(range.from, range.to);
          }}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="">
          <AnalyticsOverview />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <AnalyticsSubmissionsActivityChart />
          <AnalyticsSubmissionsByFormChart />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWrapper;
