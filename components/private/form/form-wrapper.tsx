"use client";

import useFormStore from "@/stores/form";
import useUserStore from "@/stores/user";
import { paginationFrom, paginationTo } from "@/utils/constants";
import { EBlock, EForm, EFormAnalytics, EIntegration, EProfile, ESubmission, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { BarChartIcon, PlugIcon, SendIcon, Settings2Icon } from "lucide-react";
import { useState } from "react";
import FormIntegrations from "./form-integrations";
import FormOverview from "./form-overview";
import FormSettings from "./form-settings";
import FormSubmissions from "./form-submissions";

type TView = "overview" | "submissions" | "integrations" | "settings";

const views = [
  {
    label: "Overview",
    icon: BarChartIcon,
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
    icon: PlugIcon,
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

interface Props {
  overviewSubmissions: ESubmission[];
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
  formAnalytics: EFormAnalytics;
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  integrations: EIntegration[];
}

const FormWrapper = ({
  submissions,
  blocks,
  form,
  formAnalytics,
  profile,
  subscription,
  email,
  overviewSubmissions,
  integrations,
}: Props) => {
  const formStore = useFormStore();
  const userStore = useUserStore();
  const [view, setView] = useState<TView>("overview");
  const enabledViews = views.filter((x) => x.enabled);
  const notReviewedSubmissions = formStore.submissions.filter((x) => x.status === "not_reviewed").length;

  const query = useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      userStore.setEmail(email);
      userStore.setProfile(profile);
      userStore.setSubscription(subscription);
      formStore.setForm(form);
      formStore.setFormAnalytics(formAnalytics);
      formStore.setOverviewSubmissions(overviewSubmissions);
      formStore.setSubmissions(submissions);
      formStore.setBlocks(blocks);
      formStore.setIntegrations(integrations);
      formStore.setPagination({ from: paginationFrom, to: paginationTo });
      return null;
    },
    refetchOnWindowFocus: false,
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 flex flex-col">
      <div className="border-b h-10 flex justify-start items-center gap-1 px-2 sm:px-6 overflow-x-auto">
        {enabledViews.map((v) => {
          return (
            <button
              onClick={() => setView(v.view as TView)}
              key={v.view}
              className={`${
                v.view === view ? "font-medium text-foreground" : "text-foreground/60"
              } text-xs flex justify-center items-center px-2 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
              <v.icon className={`${v.view === view ? "text-primary" : "text-foreground/60"} w-4 h-4`} />
              {v.label}
              {v.view === "submissions" && notReviewedSubmissions > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-yellow-600 bg-yellow-600/20 rounded-full">
                  {notReviewedSubmissions}
                </span>
              )}
              {v.view === view && <div className="bg-foreground/70 bottom-0 w-full h-0.5 absolute"></div>}
            </button>
          );
        })}
      </div>
      <div className="px-3 sm:px-20 lg:px-52 py-4 sm:py-8 flex justify-center flex-1 items-start overflow-y-auto">
        {view === "overview" && <FormOverview />}
        {view === "submissions" && <FormSubmissions />}
        {view === "integrations" && <FormIntegrations />}
        {view === "settings" && <FormSettings />}
      </div>
    </div>
  );
};

export default FormWrapper;
