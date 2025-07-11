"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { TOrganizationRole } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { UserIcon, UserPlus2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import OrgRoleBadge from "../../shared/custom/org-role-badge";
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
          <MembersInvite>
            <Button variant={"secondary"} size={"sm"}>
              <UserPlus2Icon className="w-4 h-4 mr-2" />
              {t("label_invite_member")}
            </Button>
          </MembersInvite>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <MemberList />
      </div>
    </div>
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
    <div className="overflow-y-auto grid gap-4 grid-cols-1">
      {app.teamMemberProfiles.map((m) => {
        return <MemberRow member={m} key={m.id} />;
      })}
    </div>
  );
};
const MemberRow = ({ member }: { member: ETeamMemberProfile }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const avatarName = `${member.name.slice(0, 1)}${member.last_name.slice(0, 1)}`.toUpperCase();
  const isYou = app.teamMemberProfile.profile_id === member.profile_id;

  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center w-full p-3 md:p-4 gap-3 md:gap-4 border-b hover:bg-muted/50 transition-colors duration-200 group">
      {/* Badge de cargo no canto superior direito (mobile only) */}
      <div className="md:hidden absolute top-3 right-3">
        <OrgRoleBadge role={member.role as TOrganizationRole} />
      </div>

      {/* Primeira coluna - Avatar e Nome */}
      <div className="flex items-center w-full md:w-[30%] gap-3 pr-10 md:pr-0">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">{avatarName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium">
            {member.name} {member.last_name}{" "}
            {isYou && <span className="text-xs text-muted-foreground">({t("label_you")})</span>}
          </span>
          <span className="text-xs text-muted-foreground truncate">{member.email}</span>
        </div>
      </div>

      {/* Segunda coluna - Cargo (apenas desktop) */}
      <div className="hidden md:block md:w-[20%]">
        <OrgRoleBadge role={member.role as TOrganizationRole} />
      </div>

      {/* Terceira coluna - Data */}
      <div className="w-full md:w-[20%] text-sm text-muted-foreground pl-11 md:pl-0 flex items-center gap-2 md:block">
        <span className="md:hidden text-xs">Entrou em:</span>
        <span>{new Date(member.created_at).toLocaleDateString(user.locale)}</span>
      </div>

      {/* Quarta coluna - Botão */}
      <div className="w-full md:w-[30%] flex justify-end pl-11 md:pl-0">
        <Button variant={"outline"} size={"sm"} className="w-full md:w-auto">
          {t("label_update_member")}
        </Button>
      </div>
    </div>
  );
};
export default MembersWrapper;
