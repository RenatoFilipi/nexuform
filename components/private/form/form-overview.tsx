"use client";

import { ConstructionIcon } from "lucide-react";

const FormOverview = () => {
  return (
    <div className="flex justify-center items-center w-full flex-1 py-28">
      <div className="flex flex-col justify-center items-center gap-3">
        <ConstructionIcon />
        <span className="text-sm text-foreground/80">Under Development</span>
      </div>
    </div>
  );
};

export default FormOverview;
