"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, CheckCircle2Icon, UserIcon, UserPlus2Icon, ZapIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ManageSubscription2 from "../../shared/subscription/manage-subscription2";
import MembersInvite from "./members-invite";

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
      const members = props.teamMemberProfiles.filter((x) => x.id !== props.teamMemberProfile.id);
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganization(props.organization);
      app.setSubscription(props.subscription);
      app.setTeamMemberProfile(props.teamMemberProfile);
      app.setTeamMemberProfiles(members);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_members")}</h1>
        <div className="flex gap-4">
          <MembersInvite>
            <Button variant={"secondary"} size={"sm"}>
              <UserPlus2Icon className="w-4 h-4 mr-2" />
              {t("label_invite_member")}
            </Button>
          </MembersInvite>
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
  const fullName = `${app.teamMemberProfile.name} ${app.teamMemberProfile.last_name}`;

  return (
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-start items-center gap-2">
            <h3 className="truncate">{fullName}</h3>
            <Badge variant={"primary"}>{app.teamMemberProfile.role}</Badge>
          </div>
          <p className="text-muted-foreground text-sm truncate">{app.teamMemberProfile.email}</p>
        </div>
        <Button variant={"outline"} size={"sm"}>
          {t("label_update_profile")}
        </Button>
      </div>
    </Card>
  );
};
const MemberList = () => {
  const t = useTranslations("app");
  const app = useAppStore();

  if (app.teamMemberProfiles.length <= 0) {
    return (
      <Card className="flex w-full justify-center items-center flex-col gap-4 py-36 px-4">
        <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
          <UserIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col justify-center items-center gap-1 text-center">
          <h3 className="text-xl font-bold text-foreground">{t("label_no_members")}</h3>
          <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("desc_no_members")}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-y-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
      {app.teamMemberProfiles.map((m) => {
        return <MemberCard member={m} key={m.id} />;
      })}
    </div>
  );
};
const MemberCard = ({ member }: { member: ETeamMemberProfile }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const avatarName = `${member.name.slice(0, 1)}${member.last_name.slice(0, 1)}`.toUpperCase();

  return (
    <Card className="flex flex-col justify-center items-center w-full p-4 gap-4">
      <div className="flex justify-start items-center w-full gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="">{avatarName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>
            {member.name} {member.last_name}
          </span>
          <span className="text-sm text-muted-foreground">{member.email}</span>
        </div>
      </div>
      <div className="flex justify-center items-center w-full flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-muted-foreground">{t("label_role")}</span>
          <Badge variant={"primary"}>{member.role}</Badge>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-muted-foreground">{t("label_joined")}</span>
          <span className="text-sm">{new Date(member.created_at).toLocaleDateString(user.locale)}</span>
        </div>
      </div>
      <Button className="w-full" variant={"outline"} size={"sm"}>
        {t("label_update_member")}
      </Button>
    </Card>
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
              <ZapIcon className="h-6 w-6 text-white" />
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
