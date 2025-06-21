"use client";

import usePlatformStore from "@/stores/platform";
import useStudioStore from "@/stores/studio";
import useUserStore from "@/stores/user";
import { fallbackColor } from "@/utils/constants";
import { EBlock, EForm, EOrganization, EProfile, ESubscription, ETeamMemberProfile, ETheme } from "@/utils/entities";
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
  theme: ETheme;
  blocks: EBlock[];
}

const EditorWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const studio = useStudioStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["editor-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations([props.organization]);
      pf.setSubscriptions([props.subscription]);
      pf.setTeamMemberProfiles([props.teamMemberProfile]);
      studio.setForm(props.form);

      const primaryColor = props.theme.custom_primary_color.trim() || fallbackColor;

      studio.setTheme({ ...props.theme, custom_primary_color: primaryColor });
      studio.setBlocks(props.blocks);
      studio.setOriginalBlocks(props.blocks);
      return null;
    },
  });

  if (query.isPending) return null;

  return <div className="border">ok</div>;
};

export default EditorWrapper;
