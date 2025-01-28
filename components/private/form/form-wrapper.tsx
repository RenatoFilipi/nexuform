"use client";

import FormStatusBadge from "@/components/shared/form-status-badge";
import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import { EBlock, EForm, ESubmission } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
  BookDownIcon,
  BookIcon,
  ExternalLinkIcon,
  ForwardIcon,
  Laptop2Icon,
  LoaderIcon,
  Settings2Icon,
  UnplugIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FormShare from "../forms/form-share";
import FormIntegrations from "./form-integrations";
import FormOverview from "./form-overview";
import FormSettings from "./form-settings";
import FormSubmissions from "./form-submissions";

type TView = "overview" | "submissions" | "integrations" | "settings";

const views = [
  {
    label: "Overview",
    icon: Laptop2Icon,
    view: "overview",
    enabled: true,
  },
  {
    label: "Submissions",
    icon: BookDownIcon,
    view: "submissions",
    enabled: true,
  },
  {
    label: "Settings",
    icon: Settings2Icon,
    view: "settings",
    enabled: true,
  },
  {
    label: "Integrations",
    icon: UnplugIcon,
    view: "integrations",
    enabled: false,
  },
];

const FormWrapper = ({
  submissions,
  blocks,
  form,
}: {
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
}) => {
  const { setForm, setBlocks, setSubmissions, form: f } = useFormStore();
  const [view, setView] = useState<TView>("overview");
  const enabledViews = views.filter((x) => x.enabled);

  useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      setForm(form);
      setBlocks(blocks);
      setSubmissions(submissions);
      return null;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex flex-col">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="flex justify-between sm:justify-start items-center gap-3 w-full sm:w-fit">
            <div className="flex items-center gap-2">
              <BookIcon className="w-4 h-4" />
              <h1 className="font-medium truncate max-w-[240px]">{f.name}</h1>
            </div>
            <FormStatusBadge status={f.status as TFormStatus} uppercase />
          </div>
          <div className="flex items-center sm:gap-4 gap-2 w-full sm:w-fit">
            <FormShare form={f}>
              <Button variant="outline" size="sm" className="w-full">
                <ForwardIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </FormShare>
            {f.status === "published" && (
              <a
                href={`/s/${f.public_url}`}
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
              <Link
                href={`/dashboard/editor/${f.id}`}
                className="w-full sm:w-fit">
                <Settings2Icon className="w-4 h-4 mr-2" />
                Editor
              </Link>
            </Button>
          </div>
        </div>
        {f.updated_at !== "".trim() ? (
          <div className="hidden sm:flex">
            <span className="text-sm text-muted-foreground">
              Form last updated {formatDateRelativeToNow(f.updated_at)}
            </span>
          </div>
        ) : (
          <div>
            <LoaderIcon className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 h-full gap-4">
        <div className="flex sm:w-fit sm:gap-3 gap-1 overflow-x-auto">
          {enabledViews.map((v) => (
            <button
              key={v.view}
              onClick={() => setView(v.view as TView)}
              className={`${
                v.view === view ? "border-foreground/30" : "border-transparent"
              } border p-2 flex items-center justify-center gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
              <v.icon className="w-4 h-4" />
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex justify-center flex-1 h-full">
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
