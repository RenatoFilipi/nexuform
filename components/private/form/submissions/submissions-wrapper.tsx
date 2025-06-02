"use client";

import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { EBlock, EForm, EProfile, ESubmission, ESubscription } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import SubmissionsList from "./submissions-list";

interface IProps {
  profile: EProfile;
  subscription: ESubscription;
  email: string;
  locale: string;
  form: EForm;
  submissions: ESubmission[];
  blocks: EBlock[];
}

const SubmissionsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const global = useGlobalStore();

  const query = useQuery({
    queryKey: ["formSubmissionsData"],
    queryFn: () => {
      user.setEmail(props.email);
      user.setProfile(props.profile);
      user.setSubscription(props.subscription);
      user.setLocale(props.locale);
      global.setForm(props.form);
      global.setBlocks(props.blocks);
      global.setSubmissions(props.submissions);
      return null;
    },
  });

  if (query.isPending) return null;

  return <SubmissionsList />;
};

export default SubmissionsWrapper;
