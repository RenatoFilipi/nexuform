"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { IContext } from "@/utils/interfaces";
import { TOrganizationRole } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import Avvvatars from "avvvatars-react";
import { PenBoxIcon, Trash2Icon, UserIcon, UserPlus2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import OrgRoleBadge from "../../shared/custom/org-role-badge";
import SubscriptionUI from "../../shared/pages/subscription-ui";
import MembersInvite from "./members-invite";
import MembersRemove from "./members-remove";
import MembersUpdate from "./members-update";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organization: EOrganization;
  subscription: ESubscription;
  teamMemberProfile: ETeamMemberProfile;
  teamMemberProfiles: ETeamMemberProfile[];
  context: IContext;
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
      app.setContext(props.context);
      return null;
    },
  });

  if (query.isPending) return null;

  if (!app.context.isSubscriptionActive) {
    return <SubscriptionUI />;
  }

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

  const currentUser = app.teamMemberProfile;
  const isCurrentUserOwner = app.organization.owner_id === currentUser.profile_id;
  const isCurrentUserAdmin = currentUser.role === "admin";
  const teamMemberProfiles = app.teamMemberProfiles;

  const members = teamMemberProfiles.map((tmp) => {
    const isYou = currentUser.profile_id === tmp.profile_id;
    const isOwner = app.organization.owner_id === tmp.profile_id;

    let isRemoveAllowed = false;
    let isUpdateAllowed = false;

    if (isCurrentUserOwner) {
      isUpdateAllowed = true;
      isRemoveAllowed = !isOwner;
    } else if (isCurrentUserAdmin) {
      isUpdateAllowed = !isOwner;
      isRemoveAllowed = !isOwner;
    } else {
      isUpdateAllowed = isYou;
      isRemoveAllowed = isYou;
    }

    return {
      isYou,
      isOwner,
      isRemoveAllowed,
      isUpdateAllowed,
      member: tmp,
    };
  });

  if (members.length <= 0) {
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
    <div className="overflow-y-auto grid">
      {members.map((m) => {
        return <MemberRow key={m.member.id} {...m} />;
      })}
    </div>
  );
};
const MemberRow = ({
  member,
  isOwner,
  isRemoveAllowed,
  isUpdateAllowed,
  isYou,
}: {
  member: ETeamMemberProfile;
  isYou: boolean;
  isOwner: boolean;
  isRemoveAllowed: boolean;
  isUpdateAllowed: boolean;
}) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();

  return (
    <div className="relative flex flex-col md:flex-row items-start md:items-center w-full p-2.5 gap-3 md:gap-4 border-b hover:bg-muted/50 transition-colors duration-200 group">
      <div className="md:hidden absolute top-3 right-3">
        <OrgRoleBadge role={member.role as TOrganizationRole} />
      </div>

      <div className="flex items-center w-full md:w-[30%] gap-3 pr-10 md:pr-0">
        <Avvvatars value={member.email} />

        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium flex justify-start items-center gap-1">
            {member.name} {member.last_name}{" "}
            {isYou && <span className="text-xs text-muted-foreground">({t("label_you")})</span>}
          </span>
          <span className="text-xs text-muted-foreground truncate">{member.email}</span>
        </div>
      </div>

      <div className="hidden md:block md:w-[20%]">
        <OrgRoleBadge role={member.role as TOrganizationRole} />
      </div>

      <div className="w-full md:w-[20%] text-sm text-muted-foreground pl-11 md:pl-0 flex items-center gap-2 md:block">
        <span className="md:hidden text-xs">{t("label_joined")}:</span>
        <span>{new Date(member.created_at).toLocaleDateString(user.locale)}</span>
      </div>

      <div className="w-full md:w-[30%] flex justify-end pl-11 md:pl-0 gap-3">
        {isUpdateAllowed && (
          <MembersUpdate member={member}>
            <Button variant={"outline"} size={"sm"} className="w-fit">
              <PenBoxIcon className="w-4 h-4" />
            </Button>
          </MembersUpdate>
        )}
        {isRemoveAllowed && (
          <MembersRemove self={isYou} member={member}>
            <Button variant={"destructive_outline"} size={"sm"} className="w-fit">
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </MembersRemove>
        )}
      </div>
    </div>
  );
};
export default MembersWrapper;
