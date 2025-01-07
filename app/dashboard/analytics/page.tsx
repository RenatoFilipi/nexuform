"use client";

import GenericLoader from "@/components/core/generic-loader";
import AnalyticsCard from "@/components/private/analytics/analytics-card";
import AnalyticsProgress from "@/components/private/analytics/analytics-progress";
import { appState } from "@/utils/types";
import { BookCheckIcon, BookMarkedIcon, ViewIcon } from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [appState, setAppState] = useState<appState>("idle");
  const [totalForms, setTotalForms] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      {appState === "loading" && (
        <div className="flex justify-center items-center flex-1">
          <GenericLoader />
        </div>
      )}
      {appState === "idle" && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-medium">Analytics</h1>
          <div className="flex flex-col sm:flex-row w-full justify-center items-start gap-4">
            <div className="grid grid-cols-3 w-full gap-4">
              <AnalyticsCard
                icon={
                  <div className="flex justify-center items-center p-2 w-fit bg-blue-500/15 rounded">
                    <BookMarkedIcon className="text-blue-600 w-5 h-5" />
                  </div>
                }
                label="Forms"
                value={totalForms.toString()}
              />
              <AnalyticsCard
                icon={
                  <div className="flex justify-center items-center p-2 w-fit bg-yellow-500/15 rounded">
                    <ViewIcon className="text-yellow-600 w-5 h-5" />
                  </div>
                }
                label="Views"
                value={totalViews.toString()}
              />
              <AnalyticsCard
                icon={
                  <div className="flex justify-center items-center p-2 w-fit bg-green-500/15 rounded">
                    <BookCheckIcon className="text-green-600 w-5 h-5" />
                  </div>
                }
                label="Submissions"
                value={totalSubmissions.toString()}
              />
            </div>
            <div className="flex w-full">
              <AnalyticsProgress forms={[]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
