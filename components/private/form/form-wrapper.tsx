"use client";

import { refreshFormSlugPageAction } from "@/app/actions";
import FormStatusBadge from "@/components/shared/form-status-badge";
import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import { EBlock, EForm, EFormAnalytics, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookIcon,
  ExternalLinkIcon,
  FilterIcon,
  ForwardIcon,
  LoaderIcon,
  SendIcon,
  Settings2Icon,
  UnplugIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FormFilters from "./form-filters";
import FormIntegrations from "./form-integrations";
import FormOverview from "./form-overview";
import FormSettings from "./form-settings";
import FormShare from "./form-share";
import FormSubmissions from "./form-submissions";

type TView = "overview" | "submissions" | "integrations" | "settings";

const views = [
  {
    label: "Overview",
    icon: SendIcon,
    view: "overview",
    enabled: true,
  },
  {
    label: "Submissions",
    icon: SendIcon,
    view: "submissions",
    enabled: true,
  },
  {
    label: "Integrations",
    icon: UnplugIcon,
    view: "integrations",
    enabled: true,
  },
  {
    label: "Settings",
    icon: Settings2Icon,
    view: "settings",
    enabled: true,
  },
];

const FormWrapper = ({
  submissions,
  blocks,
  form,
  formAnalytics,
}: {
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
  formAnalytics: EFormAnalytics;
}) => {
  const {
    setForm,
    setBlocks,
    setSubmissions,
    form: localForm,
    setFormAnalytics,
    submissions: localSubmissions,
  } = useFormStore();
  const [view, setView] = useState<TView>("overview");
  const enabledViews = views.filter((x) => x.enabled);
  const enabledFilters = view.includes("overview") || view.includes("submissions");
  const notReviewedSubmissions = localSubmissions.filter((x) => x.status === "not_reviewed").length;

  const query = useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      setForm(form);
      setBlocks(blocks);
      setSubmissions(submissions);
      setFormAnalytics(formAnalytics);
      console.log(formAnalytics);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex flex-col">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="flex justify-between sm:justify-start items-center gap-3 w-full sm:w-fit">
            <div className="flex items-center gap-2">
              <BookIcon className="w-4 h-4" />
              <h1 className="font-medium truncate max-w-[240px]">{localForm.name}</h1>
            </div>
            <FormStatusBadge status={localForm.status as TFormStatus} uppercase />
          </div>
          <div className="flex items-center sm:gap-4 gap-2 w-full sm:w-fit">
            <FormShare form={localForm}>
              <Button variant="outline" size="sm" className="w-full">
                <ForwardIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </FormShare>
            {localForm.status === "published" && (
              <a
                href={`/s/${localForm.public_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-fit">
                <Button variant="outline" size="sm">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Go to Form
                </Button>
              </a>
            )}
            <Button variant="default" size="sm" asChild>
              <Link href={`/dashboard/editor/${localForm.id}`} className="w-full sm:w-fit">
                <Settings2Icon className="w-4 h-4 mr-2" />
                Editor
              </Link>
            </Button>
          </div>
        </div>
        {localForm.updated_at !== "".trim() ? (
          <div className="hidden sm:flex">
            <span className="text-sm text-muted-foreground">
              Form last updated {formatDateRelativeToNow(localForm.updated_at)}
            </span>
          </div>
        ) : (
          <div>
            <LoaderIcon className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 h-full gap-4">
        <div className="flex justify-between items-center">
          <div className="flex sm:w-fit sm:gap-3 gap-1 overflow-x-auto">
            {enabledViews.map((v) => (
              <button
                key={v.view}
                onClick={() => setView(v.view as TView)}
                className={`${
                  v.view === view ? "border-foreground/30" : "border-transparent"
                } border p-2 flex items-center justify-center gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
                <v.icon className={`${v.view === view ? "text-primary" : "text-foreground"} w-4 h-4`} />
                {v.label}
                {v.view === "submissions" && notReviewedSubmissions > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-primary bg-primary/20 rounded-full">
                    {notReviewedSubmissions}
                  </span>
                )}
              </button>
            ))}
          </div>
          {enabledFilters && (
            <div className="flex justify-center items-center gap-2">
              <FormFilters>
                <Button variant={"outline"} size={"sm"}>
                  <FilterIcon className="w-4 h-4 mr-2" /> Filters
                </Button>
              </FormFilters>
            </div>
          )}
        </div>
        <div className="flex justify-center flex-1 h-full items-start">
          {view === "overview" && <FormOverview />}
          {view === "submissions" && <FormSubmissions />}
          {view === "integrations" && <FormIntegrations />}
          {view === "settings" && <FormSettings />}
        </div>
      </div>
    </div>
  );
};

export default FormWrapper;
