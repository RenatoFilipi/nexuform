"use client";

import { ESubmission } from "@/utils/entities";

const SubmissionList = ({ submissions }: { submissions: ESubmission[] }) => {
  if (submissions.length <= 0)
    return (
      <div className="flex justify-center items-center h-full flex-1">
        <span className="text-foreground/80 uppercase text-xs">
          No submission to show
        </span>
      </div>
    );

  return (
    <div className="flex justify-center items-center h-full">
      Submission List
    </div>
  );
};

export default SubmissionList;
