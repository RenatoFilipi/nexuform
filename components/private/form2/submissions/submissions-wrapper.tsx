"use client";

import WipUI from "@/components/shared/utils/wip-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePlatformStore from "@/stores/platform";
import useUserStore from "@/stores/user";
import {
  EBlock,
  EForm,
  EOrganization,
  EProfile,
  ESubmission,
  ESubscription,
  ETeamMemberProfile,
} from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  submissions: ESubmission[];
  blocks: EBlock[];
}

const SubmissionsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const pf = usePlatformStore();
  const [status, setStatus] = useState("all");

  const query = useQuery({
    queryKey: ["submissions-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations([props.organization]);
      pf.setSubscriptions([props.subscription]);
      pf.setTeamMemberProfiles([props.teamMemberProfile]);
      pf.setForms([props.form]);
      pf.setBlocks(props.blocks);
      pf.setSubmissions(props.submissions);
      return null;
    },
  });
  const statusButtons = [
    { label: t("label_all"), status: "all", icon: <div className="h-2 w-2 rounded-full bg-foreground"></div> },
    { label: t("label_reviewed"), status: "reviewed", icon: <div className="h-2 w-2 rounded-full bg-success"></div> },
    {
      label: t("label_not_reviewed"),
      status: "not_reviewed",
      icon: <div className="h-2 w-2 rounded-full bg-warning"></div>,
    },
    { label: t("label_ignored"), status: "ignored", icon: <div className="h-2 w-2 rounded-full bg-gray-500"></div> },
  ];
  const noSubmission = pf.submissions.length <= 0;
  if (query.isPending) return null;

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-start sm:items-center">
        <span className="font-semibold text-lg sm:text-xl">{t("label_submissions")}</span>
        {!noSubmission && (
          <div className="flex w-full sm:w-fit justify-start overflow-x-auto">
            <div className="flex justify-center items-center gap-2">
              {statusButtons.map((x) => {
                return (
                  <Button
                    key={x.status}
                    variant={"outline"}
                    size={"sm"}
                    className={`${
                      status === x.status ? "bg-foreground/10 text-foreground font-semibold" : "text-muted-foreground"
                    } flex justify-center items-center gap-2 w-full sm:w-fit`}
                    onClick={() => setStatus(x.status)}>
                    {x.icon}
                    {x.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* content */}
      {noSubmission && (
        <Card className="flex w-full justify-center items-center flex-col gap-4 py-36 px-4">
          <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
            <SendIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col justify-center items-center gap-1 text-center">
            <h3 className="text-xl font-bold text-foreground">{t("label_no_submission")}</h3>
            <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("label_desc_no_submission")}</p>
          </div>
        </Card>
      )}
      {!noSubmission && (
        <div>
          <WipUI context="Submissions list" />
        </div>
      )}
    </div>
  );
};

export default SubmissionsWrapper;
