"use client";

import CompletionRateChart from "./completion-rate-chart";
import SubmissionsActivityChart from "./submissions-activity-chart";

const FormOverview = () => {
  return (
    <div className="rounded w-full h-full flex-1 flex flex-col gap-2">
      <div className="grid sm:grid-cols-2 gap-4">
        <CompletionRateChart />
        <SubmissionsActivityChart />
      </div>
    </div>
  );
};

export default FormOverview;
