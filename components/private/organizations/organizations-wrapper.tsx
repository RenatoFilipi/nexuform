"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EInvitation, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { getDaysDifference } from "@/utils/functions";
import { TPlan } from "@/utils/pricing";
import { TOrganizationRole } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { Building2Icon, ChevronRightIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import PlanBadge from "../shared/custom/plan-badge";
import LoadingUI from "../shared/custom/loading-ui";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const user = useUserStore();
  const app = useAppStore();
  const [name, setName] = useQueryState("name", { defaultValue: "" });
  const [role, setRole] = useQueryState("role", { defaultValue: "" });
  const orgsRoles = [
    { label: `${t("label_all")}`, role: "", icon: <div className="h-2 w-2 rounded-full bg-foreground"></div> },
    { label: `${t("label_owner")}`, role: "owner", icon: <div className="h-2 w-2 rounded-full bg-yellow-400"></div> },
    { label: `${t("label_admin")}`, role: "admin", icon: <div className="h-2 w-2 rounded-full bg-pink-400"></div> },
    { label: `${t("label_staff")}`, role: "staff", icon: <div className="h-2 w-2 rounded-full bg-sky-400"></div> },
  ];

  const query = useQuery({
    queryKey: ["organizations-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setOrganizations(props.organizations);
      app.setSubscriptions(props.subscriptions);
      app.setTeamMemberProfiles(props.teamMemberProfiles);
      return null;
    },
  });

  const filteredTMPs = app.teamMemberProfiles.filter((tmp) => {
    const organization = app.organizations.find((x) => x.id === tmp.org_id);
    if (!organization) return false;

    const matchName = name.trim() === "" || organization.name.toLowerCase().includes(name.toLowerCase());

    const matchRole = role === "" || tmp.role === role;

    return matchName && matchRole;
  });
  const isEmpty = filteredTMPs.length <= 0;

  if (query.isPending)
    return (
      <div className="flex-1 mt-24 mb-14 sm:mb-0 flex flex-col gap-8 px-3 sm:px-20 lg:px-80 py-4 sm:py-8">
        <LoadingUI />
      </div>
    );

  return (
    <div className="flex-1 mt-24 mb-14 sm:mb-0 flex flex-col gap-8 px-3 sm:px-20 lg:px-80 py-4 sm:py-8">
      <section className="flex flex-col gap-6 sm:gap-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">{t("label_organizations")}</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("label_organizations")}
              className="w-full sm:w-64 hidden"
            />
            <div className="flex gap-2 overflow-x-auto">
              {orgsRoles.map((r) => (
                <Button
                  key={r.role}
                  variant="outline"
                  size="sm"
                  className={`${
                    role === r.role ? "bg-foreground/10 text-foreground" : "text-muted-foreground"
                  } flex items-center gap-2 text-sm`}
                  onClick={() => setRole(role === r.role ? "" : r.role)}>
                  {r.icon}
                  {r.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        {isEmpty && (
          <Card className="flex w-full justify-center items-center flex-col gap-4 py-28 px-4">
            <div className="flex justify-center items-center p-3 w-fit rounded bg-foreground/5">
              <Building2Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col justify-center items-center gap-1 text-center">
              <h3 className="text-muted-foreground max-w-md text-sm/relaxed">{t("label_no_organizations")}</h3>
            </div>
          </Card>
        )}
        {!isEmpty && (
          <ul className="overflow-y-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTMPs.map((tmp) => (
              <OrganizationItem key={tmp.id} teamMemberProfile={tmp} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
const OrganizationItem = (props: { teamMemberProfile: ETeamMemberProfile }) => {
  const t = useTranslations("app");
  const app = useAppStore();
  const tmp = props.teamMemberProfile;

  const organization = app.organizations.find((x) => x.id === tmp.org_id) as EOrganization;
  const subscription = app.subscriptions.find((x) => x.org_id === tmp.org_id) as ESubscription;

  const orgPath = `/dashboard/organizations/${organization.public_id}/forms`;

  const now = new Date();
  const dueDate = new Date(subscription.due_date);

  const orgRole = tmp.role as TOrganizationRole;
  const remainingDays = getDaysDifference(now, dueDate);

  const isCanceled = subscription.status === "canceled";
  const isPastDue = subscription.status === "past_due";
  const isActive = subscription.status === "active";
  const isExpired = now > dueDate;

  const renderStatusBadge = () => {
    if (isCanceled) {
      return <Badge variant="destructive">{t("label_canceled")}</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">{t("label_expired_sub")}</Badge>;
    }
    if (isPastDue) {
      return <Badge variant="warning">{t("label_past_due")}</Badge>;
    }
    if (isActive) {
      return <Badge variant="success">{t("label_active")}</Badge>;
    }
    return null;
  };

  return (
    <a href={orgPath} className="block">
      <Card
        className="
      relative flex flex-col h-48 p-5
      shadow-sm hover:shadow-lg
      hover:border-primary/40
      transition-all duration-300 ease-out
      cursor-pointer overflow-hidden group
      hover:bg-primary/10
    ">
        <div className="flex flex-col justify-between h-full relative z-10">
          {/* Top Section: Nome + Role + Plano */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold tracking-tight text-foreground line-clamp-1">
                {organization.name}
              </h3>
              <span className="text-xs text-muted-foreground capitalize">
                {orgRole === "owner" && t("label_owner")}
                {orgRole === "admin" && t("label_admin")}
                {orgRole === "staff" && t("label_staff")}
              </span>
            </div>

            {/* Badge do Plano sempre visível no topo */}
            <PlanBadge type={subscription.plan as TPlan} size="lg" />
          </div>

          {/* Bottom Section: Status + Dias */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              {renderStatusBadge()}
              {!isCanceled && !isExpired && (
                <p className={`text-xs font-medium ${isPastDue ? "text-warning" : "text-muted-foreground"}`}>
                  {t("label_n_days_remaining", { n: remainingDays })}
                </p>
              )}
            </div>

            {/* Ícone de navegação */}
            <ChevronRightIcon
              className="
            w-5 h-5 text-muted-foreground
            group-hover:text-primary transition-colors
          "
            />
          </div>
        </div>
      </Card>
    </a>
  );
};

export default OrganizationsWrapper;
