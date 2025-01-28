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
interface IView {
  label: string;
  icon: React.JSX.Element;
  view: TView;
}
const views: IView[] = [
  {
    label: "Overview",
    icon: <Laptop2Icon className="w-4 h-4" />,
    view: "overview",
  },
  {
    label: "Submissions",
    icon: <BookDownIcon className="w-4 h-4" />,
    view: "submissions",
  },
  {
    label: "Integrations",
    icon: <UnplugIcon className="w-4 h-4" />,
    view: "integrations",
  },
  {
    label: "Settings",
    icon: <Settings2Icon className="w-4 h-4" />,
    view: "settings",
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
  const { setForm, setBlocks, setSubmissions } = useFormStore();
  const [view, setView] = useState<TView>("overview");

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
            <div className="flex justify-center items-center gap-2">
              <BookIcon className="w-4 h-4" />
              <h1 className="font-medium truncate max-w-[240px]">
                {form.name}
              </h1>
            </div>
            <FormStatusBadge status={form.status as TFormStatus} uppercase />
          </div>
          <div className="flex justify-center items-center sm:gap-4 gap-2 w-full sm:w-fit">
            <FormShare form={form}>
              <Button variant={"outline"} size={"sm"} className="w-full">
                <ForwardIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </FormShare>
            {form.status === "published" && (
              <Button
                variant={"outline"}
                size={"sm"}
                className="w-full sm:w-fit"
                asChild>
                <a
                  target="_blank"
                  href={`/s/${form.public_url}`}
                  rel="noopener noreferrer"
                  className="flex justify-center items-center">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Go to Form
                </a>
              </Button>
            )}
            <Button variant={"default"} size={"sm"} className="w-full" asChild>
              <Link href={`/dashboard/editor/${form.id}`}>
                <Settings2Icon className="w-4 h-4 mr-2" />
                Editor
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex">
          <span className="text-sm text-foreground/80">
            Form last updated {formatDateRelativeToNow(form.updated_at)}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-full gap-4">
        <div className="flex sm:w-fit sm:gap-3 gap-1 overflow-x-auto">
          {views.map((v, i) => {
            return (
              <button
                key={i}
                onClick={() => setView(v.view)}
                className={`${
                  v.view === view &&
                  "border border-foreground/25 text-foreground"
                }  border border-transparent p-2 flex justify-center items-center gap-2 text-sm hover:bg-foreground/5 rounded text-foreground/80`}>
                {v.icon}
                {v.label}
              </button>
            );
          })}
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
