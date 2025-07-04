"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import WipUI from "../../shared/custom/wip-ui";

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
  const t = useTranslations("app");
  const app = useAppStore();
  const user = useUserStore();
  const avatarName = `${user.profile.first_name.slice(0, 1)}${user.profile.last_name.slice(0, 1)}`.toUpperCase();
  const fullName = `${app.teamMemberProfile.name} ${app.teamMemberProfile.last_name}`;
  const isOrgOwner = app.organization.owner_id === app.teamMemberProfile.profile_id;

  return (
    <Card className="p-5 flex justify-between items-center w-full">
      <div className="flex justify-center items-center gap-4">
        <Avatar>
          <AvatarFallback>{avatarName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-start gap-1">
          <span>{fullName}</span>
          <span className="text-sm">{app.teamMemberProfile.email}</span>
          <div>{isOrgOwner && <span className="text-xs text-muted-foreground">Owner</span>}</div>
        </div>
      </div>
      <div>
        <Button variant={"outline"} size={"sm"}>
          Update Profile
        </Button>
      </div>
    </Card>
  );
};
const MemberList = () => {
  return (
    <div>
      <WipUI context="List of members" />
    </div>
  );
};
export default MembersWrapper;
