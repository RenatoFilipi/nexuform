"use client";

import GenericLoader from "@/components/core/generic-loader";
import FormGroupRelease from "@/components/private/forms/form-group-release";
import { mockBlocks, mockForms } from "@/helpers/mocks";
import { appState, colorLabel } from "@/helpers/types";
import useSubmissionStore from "@/stores/submission";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";

const R = () => {
  const {
    setId,
    setName,
    setDescription,
    setStatus,
    setTheme,
    setSubmitLabel,
    setBlocks,
  } = useSubmissionStore();
  const pathname = usePathname();
  const formId = pathname.split("/")[2];
  const [appState, setAppState] = useState<appState>("loading");

  useQuery({
    queryKey: ["submissionPageData"],
    queryFn: () => {
      const form = mockForms.find((x) => x.id === formId);
      const blocks = mockBlocks.filter((x) => x.form_id === formId);
      if (!form) {
        setAppState("idle");
        return null;
      }
      setId(form.id);
      setName(form.name);
      setDescription(form.description);
      setTheme(form.theme as colorLabel);
      setSubmitLabel(form.submit_label);
      setStatus(form.status);
      setBlocks(blocks);
      setAppState("idle");
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (appState === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center flex-col gap-1">
          <GenericLoader />
          <span className="text-sm text-foreground/80">Loading Form</span>
        </div>
      </div>
    );
  }
  if (appState === "idle") {
    return (
      <div className="flex justify-center h-screen overflow-y-auto">
        <div className="flex flex-col sm:w-[600px] px-5 sm:px-0">
          <FormGroupRelease />
        </div>
      </div>
    );
  }
  if (appState === "error") {
    return (
      <div className="flex justify-center items-center h-screen">error</div>
    );
  }
};

export default R;
