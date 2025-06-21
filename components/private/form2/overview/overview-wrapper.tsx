"use client";

import useUserStore from "@/stores/user";
import {
  EForm,
  EOrganization,
  EProfile,
  ESubmissionLog,
  ESubscription,
  ETeamMemberProfile,
  EViewLog,
} from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  form: EForm;
  submissionLogs: ESubmissionLog[];
  viewLogs: EViewLog[];
}

const OverviewWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["overview-page"],
    queryFn: () => {
      return null;
    },
  });

  if (query.isPending) return null;

  return <></>;
};

export default OverviewWrapper;
