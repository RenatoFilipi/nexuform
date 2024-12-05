"use client";

import GenericLoader from "@/components/core/generic-loader";
import { appState } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";

const R = () => {
  const pathname = usePathname();
  const [appState, setAppState] = useState<appState>("loading");

  useQuery({
    queryKey: ["responsePageData"],
    queryFn: () => {
      return null;
    },
  });

  if (appState === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center flex-col gap-1">
          <GenericLoader />
          <span className="text-sm text-foreground/80">Loading form</span>
        </div>
      </div>
    );
  }
  if (appState === "idle") {
    return (
      <div className="flex justify-center items-center h-screen">idle</div>
    );
  }
  if (appState === "error") {
    return (
      <div className="flex justify-center items-center h-screen">error</div>
    );
  }
};

export default R;
