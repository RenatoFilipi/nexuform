"use client";

import useFormStore from "@/stores/form";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { paginationFrom, paginationTo } from "@/utils/constants";
import {
  EBlock,
  EForm,
  EFormAnalytics,
  EProfile,
  ESubmission,
  ESubmissionLog,
  ESubscription,
  EViewLog,
} from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { BarChartIcon, SendIcon, SettingsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FormOverview from "./form-overview";
import FormSubmissions from "./form-submissions";

type TView = "overview" | "submissions" | "integrations" | "settings";

interface IProps {
  overviewSubmissions: ESubmission[];
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
  formAnalytics: EFormAnalytics;
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  forms: EForm[];
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
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
  locale,
  forms,
  viewLogs,
  submissionLogs,
}: IProps) => {
  const t = useTranslations("app");
  const views = [
    {
      label: t("nav_overview"),
      icon: BarChartIcon,
      view: "overview",
      enabled: true,
    },
    {
      label: t("nav_submissions"),
      icon: SendIcon,
      view: "submissions",
      enabled: true,
    },
    {
      label: t("nav_settings"),
      icon: SettingsIcon,
      view: "settings",
      enabled: false,
    },
  ];
  const formStore = useFormStore();
  const user = useUserStore();
  const global = useGlobalStore();
  const [view, setView] = useState<TView>("overview");
  const enabledViews = views.filter((x) => x.enabled);
  const notReviewedSubmissions = global.submissions.filter((x) => x.status === "not_reviewed").length;

  const query = useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      user.setEmail(email);
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setLocale(locale);
      formStore.setForm(form);
      formStore.setFormAnalytics(formAnalytics);
      formStore.setOverviewSubmissions(overviewSubmissions);
      formStore.setSubmissions(submissions);
      formStore.setBlocks(blocks);
      formStore.setPagination({ from: paginationFrom, to: paginationTo });
      formStore.setForms(forms);
      formStore.setSubmissionLogs(submissionLogs);
      formStore.setViewLogs(viewLogs);
      global.setForm(form);
      global.setSubmissions(submissions);
      global.setForms(forms);
      global.setSubmissionLogs(submissionLogs);
      global.setViewLogs(viewLogs);
      global.setBlocks(blocks);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-12 mb-12 sm:mb-0 flex flex-col h-dvh">
      <div className="border-b h-10 flex justify-start items-center gap-1 px-2 sm:px-6 overflow-x-auto">
        {enabledViews.map((v) => {
          return (
            <button
              onClick={() => setView(v.view as TView)}
              key={v.view}
              className={`${
                v.view === view ? "font-medium text-foreground" : "text-muted-foreground"
              } text-xs flex justify-center items-center px-2 hover:bg-foreground/5 relative rounded gap-2 h-full`}>
              <v.icon className={`${v.view === view ? "text-primary" : "text-muted-foreground"} w-4 h-4`} />
              <div className="truncate">{v.label}</div>
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
      <div className="px-3 sm:px-20 lg:px-52 py-4 sm:py-4 flex justify-center flex-1 items-start overflow-y-auto">
        {view === "overview" && <FormOverview />}
        {view === "submissions" && <FormSubmissions />}
      </div>
    </div>
  );
};

export default FormWrapper;
