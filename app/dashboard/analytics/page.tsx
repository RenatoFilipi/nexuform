"use client";

import GenericLoader from "@/components/core/generic-loader";
import AnalyticsCard from "@/components/private/analytics/analytics-card";
import AnalyticsProgress from "@/components/private/analytics/analytics-progress";
import { mockAnalytics, mockForms } from "@/helpers/mocks";
import { FormProps } from "@/helpers/modules";
import { appState } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { BookCheckIcon, FileIcon, ViewIcon } from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const [totalForms, setTotalForms] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [forms, setForms] = useState<FormProps[]>([]);

  useQuery({
    queryKey: ["analyticsData"],
    queryFn: () => {
      setTotalForms(mockAnalytics.total_forms);
      setTotalSubmissions(mockAnalytics.total_submissions);
      setTotalViews(mockAnalytics.total_views);
      setForms(mockForms);
      setAppState("idle");
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      {appState === "loading" && (
        <div className="flex justify-center items-center flex-1">
          <GenericLoader />
        </div>
      )}
      {appState === "idle" && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Analytics</h1>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnalyticsCard
                icon={<FileIcon />}
                label="Total Forms"
                value={totalForms.toString()}
              />
              <AnalyticsCard
                icon={<ViewIcon />}
                label="Total Views"
                value={totalViews.toString()}
              />
              <div className="col-span-2 sm:col-span-1">
                <AnalyticsCard
                  icon={<BookCheckIcon />}
                  label="Total Submissions"
                  value={totalSubmissions.toString()}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* <AnalyticsChart /> */}
              <AnalyticsProgress forms={forms} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
