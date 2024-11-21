"use client";

import AnalyticsCard from "@/components/private/analytics/analytics-card";
import ChartSubmissions from "@/components/private/analytics/chart-submissions";
import { appState } from "@/helpers/types";
import { AnalyticsContent } from "@/mocks/analytics";
import { FormProgressProps } from "@/models/analytics";
import { useQuery } from "@tanstack/react-query";
import { BookCheckIcon, FileIcon } from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const [totalForms, setTotalForms] = useState("");
  const [totalSubmissions, setTotalSubmissions] = useState("");
  const [forms, setForms] = useState<FormProgressProps[]>([]);

  useQuery({
    queryKey: ["analyticsData"],
    queryFn: () => {
      setTotalForms(AnalyticsContent.forms_total.toString());
      setTotalSubmissions(AnalyticsContent.submissions_total.toString());
      setForms(AnalyticsContent.forms);
      setAppState("idle");
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <AnalyticsCard
              icon={<FileIcon className="text-foreground w-6 h-6" />}
              title="Total Forms"
              value={totalForms}
              state={appState}
            />
            <AnalyticsCard
              icon={<BookCheckIcon className="text-foreground w-6 h-6" />}
              title="Total Submissions"
              value={totalSubmissions}
              state={appState}
            />
          </div>
          <ChartSubmissions forms={forms} state={appState} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
