"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EInvitations, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { getPlanName } from "@/utils/functions";
import { TOrganizationStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { BoxesIcon, Clock2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import WipUI from "../shared/custom/wip-ui";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
  invitations: EInvitations[];
}
const OrganizationsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();

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
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col gap-6 px-3 sm:px-20 lg:px-56 py-4 sm:py-8">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_organizations")} </h1>
      </div>
      <div className="flex flex-col gap-6">
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {app.teamMemberProfiles.map((tmp) => {
            return <OrganizationsCard key={tmp.id} teamMemberProfile={tmp} />;
          })}
        </div>
        <PendingInvitationsList />
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
      <Card className="flex flex-col justify-between h-44 p-4 border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm cursor-pointer">
        <div className="flex justify-between items-start w-full">
          <div className="flex justify-start items-center gap-3">
            <div className="flex justify-center items-center p-2 bg-foreground/5 rounded w-fit">
              <BoxesIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">{organization.name}</span>
          </div>
          <OrganizationStatusBadge status={organization.status as TOrganizationStatus} />
        </div>
        <div>
          <span className="text-sm text-muted-foreground">{plan}</span>
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
        <Badge className="w-fit" variant={"gray"} uppercase={props.uppercase}>
          {t("label_inactive")}
        </Badge>
      );
    }
  }
};

const PendingInvitationsList = () => {
  const t = useTranslations("app");
  const app = useAppStore();
  const hasPendingInvitations = app.receivedInvitations.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_pending_invitations")}</h1>
      </div>
      {!hasPendingInvitations && (
        <Card className="flex w-full justify-center items-center flex-col gap-4 py-14 px-4">
          <div className="flex justify-center items-center p-3 w-fit rounded bg-primary/10">
            <Clock2Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col justify-center items-center gap-1 text-center">
            <h3 className="text-xl font-bold text-foreground">{t("label_no_pending_invitations")}</h3>
            <p className="text-muted-foreground max-w-md text-sm/relaxed">{t("desc_pending_invitations")}</p>
          </div>
        </Card>
      )}
      {hasPendingInvitations && (
        <div>
          <WipUI context="Pending invites" />
        </div>
      )}
    </div>
  );
};

export default OrganizationsWrapper;
