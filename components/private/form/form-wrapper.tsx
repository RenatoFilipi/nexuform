"use client";

import FormStatusBadge from "@/components/shared/form-status-badge";
import { Button } from "@/components/ui/button";
import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { paginationFrom, paginationTo } from "@/utils/constants";
import { EBlock, EForm, EFormAnalytics, EProfile, ESubmission, ESubscription } from "@/utils/entities";
import { formatDateRelativeToNow } from "@/utils/functions";
import { TFormStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLinkIcon,
  ForwardIcon,
  Layers2Icon,
  LoaderIcon,
  SendIcon,
  Settings2Icon,
  UnplugIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FormIntegrations from "./form-integrations";
import FormOverview from "./form-overview";
import FormSettings from "./form-settings";
import FormShare from "./form-share";
import FormSubmissions from "./form-submissions";

type TView = "overview" | "submissions" | "integrations" | "settings";

const views = [
  {
    label: "Overview",
    icon: Layers2Icon,
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
  profile,
  subscription,
  email,
  overviewSubmissions,
}: {
  overviewSubmissions: ESubmission[];
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
  formAnalytics: EFormAnalytics;
  profile: EProfile;
  subscription: ESubscription;
  email: string;
}) => {
  const formStore = useFormStore();
  const userStore = useUserStore();
  const [view, setView] = useState<TView>("overview");
  const enabledViews = views.filter((x) => x.enabled);
  const notReviewedSubmissions = formStore.submissions.filter((x) => x.status === "not_reviewed").length;

  const query = useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      formStore.setForm(form);
      formStore.setBlocks(blocks);
      formStore.setSubmissions(submissions);
      formStore.setOverviewSubmissions(overviewSubmissions);
      formStore.setFormAnalytics(formAnalytics);
      userStore.setProfile(profile);
      userStore.setSubscription(subscription);
      userStore.setEmail(email);
      formStore.setPagination({ from: paginationFrom, to: paginationTo });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 lg:px-36 sm:px-6 flex-1 mt-14">
      <div className="flex flex-col">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="flex justify-between sm:justify-start items-center gap-3 w-full sm:w-fit">
            <div className="flex items-center gap-2">
              <h1 className="font-medium truncate max-w-[240px]">{formStore.form.name}</h1>
            </div>
            <FormStatusBadge status={formStore.form.status as TFormStatus} uppercase />
            {formStore.form.updated_at !== "".trim() ? (
              <div className="hidden sm:flex">
                <span className="text-xs text-foreground/60">
                  Form last updated {formatDateRelativeToNow(formStore.form.updated_at)}
                </span>
              </div>
            ) : (
              <div>
                <LoaderIcon className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
          <div className="flex items-center sm:gap-4 gap-2 w-full sm:w-fit">
            <FormShare form={formStore.form}>
              <Button variant="outline" size="sm" className="w-full">
                <ForwardIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
            </FormShare>
            {formStore.form.status === "published" && (
              <a href={`/s/${formStore.form.public_url}`} target="_blank" rel="noopener noreferrer" className="">
                <Button variant="outline" size="sm">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  Go to Form
                </Button>
              </a>
            )}
            <Button variant="default" size="sm" asChild>
              <Link href={`/dashboard/editor/${formStore.form.id}`} className="w-full sm:w-fit">
                <Settings2Icon className="w-4 h-4 mr-2" />
                Editor
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-full gap-4 overflow-y-auto">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="w-full overflow-x-auto">
            <div className="flex sm:w-fit sm:gap-2 gap-1">
              {enabledViews.map((v) => (
                <button
                  key={v.view}
                  onClick={() => setView(v.view as TView)}
                  className={`${
                    v.view === view
                      ? "border-foreground/30 text-foreground/100 font-medium"
                      : "border-transparent text-foreground/70"
                  } border p-2 flex items-center justify-center gap-2 text-sm hover:bg-foreground/5 rounded flex-1`}>
                  <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/70"} w-4 h-4`} />
                  {v.label}
                  {v.view === "submissions" && notReviewedSubmissions > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-yellow-600 bg-yellow-600/20 rounded-full">
                      {notReviewedSubmissions}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-1 h-full items-start overflow-y-auto">
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
