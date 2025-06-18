"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import usePlatformStore from "@/stores/platform";
import useUserStore from "@/stores/user";
import { EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { getPlanName } from "@/utils/functions";
import { TOrganizationStatus } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { BoxesIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  organizations: EOrganization[];
  subscriptions: ESubscription[];
  teamMemberProfiles: ETeamMemberProfile[];
}
const OrganizationsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const pf = usePlatformStore();
  const user = useUserStore();

  const query = useQuery({
    queryKey: ["organizations-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      pf.setOrganizations(props.organizations);
      pf.setSubscriptions(props.subscriptions);
      pf.setTeamMemberProfiles(props.teamMemberProfiles);
      return null;
    },
  });

  if (query.isPending) return null;

  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col gap-6 sm:gap-10 px-3 sm:px-20 lg:px-56 py-4 sm:py-8">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_organizations")} </h1>
        <Button variant={"secondary"} size={"sm"} className="" asChild>
          <Link href="/dashboard/forms/new">
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("label_new_organization")}
          </Link>
        </Button>
      </div>
      <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pf.teamMemberProfiles.map((tmp) => {
          return <OrganizationsCard key={tmp.id} teamMemberProfile={tmp} />;
        })}
      </div>
    </div>
  );
};

interface ICardProps {
  teamMemberProfile: ETeamMemberProfile;
}
const OrganizationsCard = (props: ICardProps) => {
  const pf = usePlatformStore();
  const tmp = props.teamMemberProfile;
  const organization = pf.organizations.find((x) => x.id === tmp.org_id) as EOrganization;
  const subscription = pf.subscriptions.find((x) => x.org_id === tmp.org_id) as ESubscription;
  const orgPath = `organizations/${organization.public_id}/forms`;
  const plan = getPlanName(subscription.plan);

  return (
    <a href={orgPath}>
      <Card className="flex h-20 p-5 justify-between items-center border hover:border-primary/50 transition-colors duration-200 group hover:shadow-sm cursor-pointer">
        <div className="flex justify-center items-center gap-4">
          <div className="flex justify-center items-center p-2 bg-foreground/5 rounded">
            <BoxesIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{organization.name}</span>
            <span className="text-xs text-muted-foreground">{plan}</span>
          </div>
        </div>
        <div className="">
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
        <Badge className="w-fit" variant={"gray"} uppercase={props.uppercase}>
          {t("label_inactive")}
        </Badge>
      );
    }
  }
};

export default OrganizationsWrapper;
