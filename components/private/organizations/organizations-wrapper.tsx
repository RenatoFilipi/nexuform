"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EInvitation, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { formatDateRelativeToNow, getPlanName } from "@/utils/functions";
import { createClient } from "@/utils/supabase/client";
import { TOrganizationStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { BoxesIcon, CheckIcon, ChevronRightIcon, ClockIcon, MailPlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
  invitations: EInvitation[];
}
const OrganizationsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const hasPendingInvitations = app.receivedInvitations.length > 0;

  const query = useQuery({
    queryKey: ["organizations-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganizations(props.organizations);
      app.setSubscriptions(props.subscriptions);
      app.setTeamMemberProfiles(props.teamMemberProfiles);
      app.setReceivedInvitations(props.invitations);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col gap-6 px-3 sm:px-20 lg:px-60 py-4 sm:py-8">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_organizations")} </h1>
      </div>
      <div className="flex flex-col gap-6">
        {hasPendingInvitations && (
          <div className="grid gap-6">
            {app.receivedInvitations.map((invitation) => {
              return <InvitationCard key={invitation.id} invitation={invitation} />;
            })}
          </div>
        )}
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {app.teamMemberProfiles.map((tmp) => {
            return <OrganizationsCard key={tmp.id} teamMemberProfile={tmp} />;
          })}
        </div>
      </div>
    </div>
  );
};
interface ICardProps {
  teamMemberProfile: ETeamMemberProfile;
}
const OrganizationsCard = (props: ICardProps) => {
  const app = useAppStore();
  const tmp = props.teamMemberProfile;
  const organization = app.organizations.find((x) => x.id === tmp.org_id) as EOrganization;
  const subscription = app.subscriptions.find((x) => x.org_id === tmp.org_id) as ESubscription;
  const orgPath = `/dashboard/organizations/${organization.public_id}/forms`;
  const plan = getPlanName(subscription.plan);

  return (
    <a href={orgPath}>
      <Card className="flex flex-col justify-between h-40 p-4 border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm cursor-pointer relative">
        <div className="flex justify-between items-start w-full">
          <div className="flex justify-start items-center gap-3">
            <div className="flex justify-center items-center p-3 bg-foreground/5 rounded-xl w-fit">
              <BoxesIcon className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold">{organization.name}</span>
              <div className="flex gap-2">
                <Badge variant={"default"}>{plan}</Badge>
              </div>
            </div>
          </div>
          <button className="absolute right-4 top-4 text-foreground-lighter transition-all duration-200 group-hover:right-3 group-hover:text-foreground ">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div>
          <OrganizationStatusBadge status={organization.status as TOrganizationStatus} />
        </div>
      </Card>
    </a>
  );
};
interface IBadgeProps {
  uppercase?: boolean;
  status: TOrganizationStatus;
}
const OrganizationStatusBadge = (props: IBadgeProps) => {
  const t = useTranslations("app");

  switch (props.status) {
    case "active": {
      return (
        <Badge className="w-fit" variant={"success"} uppercase={props.uppercase}>
          {t("label_active")}
        </Badge>
      );
    }
    case "inactive": {
      return (
        <Badge className="w-fit" variant={"warning"} uppercase={props.uppercase}>
          {t("label_inactive")}
        </Badge>
      );
    }
  }
};
const InvitationCard = ({ invitation }: { invitation: EInvitation }) => {
  const user = useUserStore();
  const supabase = createClient();
  const invitedAt = formatDateRelativeToNow(new Date(invitation.created_at).toISOString(), user.locale);

  return (
    <Card className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 w-full hover:bg-muted/50 transition-colors">
      <div className="flex flex-1 justify-start items-start gap-4 w-full">
        <div className="flex justify-center items-center rounded-xl bg-foreground text-background p-3">
          <MailPlusIcon className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-base">{invitation.org_name}</span>
            <Badge>{invitation.role}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Invited by <span className="font-medium text-foreground">{invitation.inviter_name}</span>
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>{invitedAt}</span>
          </div>
        </div>
      </div>
      <div className="flex sm:flex-col justify-end items-stretch gap-3 w-full sm:w-auto">
        <Button variant={"secondary"} size={"sm"} className="w-full sm:w-32 gap-2">
          <CheckIcon className="w-4 h-4" />
          Accept
        </Button>
        <Button variant={"outline"} size={"sm"} className="w-full sm:w-32 gap-2">
          <XIcon className="w-4 h-4" />
          Decline
        </Button>
      </div>
    </Card>
  );
};

export default OrganizationsWrapper;
