"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  teamMemberProfiles: ETeamMemberProfile[];
}

const MembersWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["members-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setTeamMemberProfiles(props.teamMemberProfiles);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_members")}</h1>
        <div className="flex gap-4">
          <Button variant={"secondary"} size={"sm"}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <MemberProfile />
        <MemberList />
      </div>
    </div>
  );
};
const MemberProfile = () => {
  return <Card className="">Profile</Card>;
};
const MemberList = () => {
  return (
    <div>
      <div>header</div>
      <Card>Members list</Card>
    </div>
  );
};
export default MembersWrapper;
