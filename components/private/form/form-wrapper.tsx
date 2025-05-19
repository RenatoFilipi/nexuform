"use client";

import { Badge } from "@/components/ui/badge";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { paginationFrom, paginationTo } from "@/utils/constants";
import { EBlock, EForm, EProfile, ESubmission, ESubmissionLog, ESubscription, EViewLog } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { BarChartIcon, SendIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FormOverview from "./form-overview";
import FormShare from "./form-share";
import FormSubmissions from "./form-submissions";

type TView = "overview" | "submissions" | "share";

interface IProps {
  submissions: ESubmission[];
  blocks: EBlock[];
  form: EForm;
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
  profile,
  subscription,
  email,
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
      label: t("label_share"),
      icon: Share2Icon,
      view: "share",
      enabled: true,
    },
  ];
  const user = useUserStore();
  const global = useGlobalStore();
  const [view, setView] = useState<TView>("overview");
  const enabledViews = views.filter((x) => x.enabled);

  const query = useQuery({
    queryKey: ["formData"],
    queryFn: () => {
      user.setEmail(email);
      user.setProfile(profile);
      user.setSubscription(subscription);
      user.setLocale(locale);
      global.setForm(form);
      global.setSubmissions(submissions);
      global.setForms(forms);
      global.setSubmissionLogs(submissionLogs);
      global.setViewLogs(viewLogs);
      global.setBlocks(blocks);
      global.setSubmissionPagination({ from: paginationFrom, to: paginationTo });
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
              {v.view === view && <div className="bg-foreground/70 bottom-0 w-full h-0.5 absolute"></div>}
            </button>
          );
        })}
      </div>
      <div className="px-3 sm:px-20 lg:px-52 py-4 sm:py-4 flex justify-center flex-1 items-start overflow-y-auto">
        {view === "overview" && <FormOverview />}
        {view === "submissions" && <FormSubmissions />}
        {view === "share" && <FormShare />}
      </div>
    </div>
  );
};

export default FormWrapper;
