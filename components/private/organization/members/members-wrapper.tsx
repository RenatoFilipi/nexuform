"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, CheckCircle2Icon, UserPlus2Icon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import WipUI from "../../shared/custom/wip-ui";
import { Badge } from "@/components/ui/badge";
import ManageSubscription2 from "../../shared/subscription/manage-subscription2";

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
  const isPro = app.subscription.plan === "pro";

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
        {isPro && (
          <div className="flex gap-4">
            <Button variant={"secondary"} size={"sm"}>
              <UserPlus2Icon className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <MemberProfile />
        {isPro ? <MemberList /> : <UpgradeToPro />}
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
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="">{avatarName}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 gap-1">
            <h3 className="font-semibold text-lg truncate">{fullName}</h3>
            <p className="text-muted-foreground text-sm truncate">{app.teamMemberProfile.email}</p>
            <div className="mt-1 flex items-center gap-2">
              {isOrgOwner ? <Badge variant={"gold"}>Owner</Badge> : <Badge variant={"primary"}>Member</Badge>}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="">
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
const UpgradeToPro = () => {
  const t = useTranslations("app");
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-purple-600 text-white">
      <div className="relative z-10 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">{t("label_upgrade_pro")}</h3>
          </div>
          <p className="max-w-[85%] text-sm leading-relaxed text-white/90">{t("label_up_members")}</p>
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
              <span className="text-sm">{t("label_members_feat_01")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
              <span className="text-sm">{t("label_members_feat_02")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-300" />
              <span className="text-sm">{t("label_members_feat_03")}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center sm:justify-end">
            <ManageSubscription2 selected="pro">
              <Button size="sm" variant={"secondary"} className="w-full sm:w-fit">
                <ArrowUpRightIcon className="w-4 h-4 mr-2" />
                {t("label_upgrade_pro")}
              </Button>
            </ManageSubscription2>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default MembersWrapper;
