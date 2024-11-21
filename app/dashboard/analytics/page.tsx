"use client";

import AnalyticsCard from "@/components/private/analytics/analytics-card";
import ChartSubmissions from "@/components/private/analytics/chart-submissions";
import { appState } from "@/helpers/types";
import { AnalyticsContent } from "@/mocks/analytics";
import { BookCheckIcon, FileIcon } from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [appState] = useState<appState>("idle");

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <AnalyticsCard
              icon={<FileIcon className="text-background w-6 h-6" />}
              title="Total Forms"
              value={AnalyticsContent.forms_total.toString()}
              state={appState}
            />
            <AnalyticsCard
              icon={<BookCheckIcon className="text-background w-6 h-6" />}
              title="Total Submissions"
              value={AnalyticsContent.submissions_total.toString()}
              state={appState}
            />
          </div>
          <ChartSubmissions forms={AnalyticsContent.forms} state={appState} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
