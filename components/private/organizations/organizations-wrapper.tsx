"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EInvitation, EOrganization, EProfile, ESubscription, ETeamMemberProfile } from "@/utils/entities";
import { formatDateRelativeToNow, getDaysDifference } from "@/utils/functions";
import { TPlan } from "@/utils/pricing";
import { createClient } from "@/utils/supabase/client";
import { TOrganizationRole } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronRightIcon, Loader2Icon, LoaderIcon, MailPlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import OrgRoleBadge from "../shared/custom/org-role-badge";
import PlanBadge from "../shared/custom/plan-badge";
import LoadingUI from "../shared/custom/loading-ui";

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

  if (query.isPending)
    return (
      <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col gap-8 px-3 sm:px-20 lg:px-80 py-4 sm:py-8">
        <LoadingUI />
      </div>
    );

  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col gap-8 px-3 sm:px-20 lg:px-80 py-4 sm:py-8">
      {/* Invitations */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t("label_invitations")}</h2>
        {hasPendingInvitations ? (
          <ul className="flex flex-col border border-border rounded-xl overflow-hidden bg-card divide-y divide-border">
            {app.receivedInvitations.map((invitation) => (
              <InvitationItem key={invitation.id} invitation={invitation} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-7 rounded-xl border border-dashed border-border bg-muted/5 text-center">
            <MailPlusIcon className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("label_no_pending_invitations")}</p>
          </div>
        )}
      </section>

      {/* Organizations */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {t("label_organizations")}
        </h2>
        <ul className="overflow-y-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {app.teamMemberProfiles.map((tmp) => (
            <OrganizationItem key={tmp.id} teamMemberProfile={tmp} />
          ))}
        </ul>
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
      bg-gradient-to-br from-background via-muted/10 to-background
      shadow-sm hover:shadow-lg
      hover:border-primary/40
      transition-all duration-300 ease-out
      cursor-pointer overflow-hidden group
    ">
        {/* Overlay premium */}
        <div
          className="
        absolute inset-0 rounded-2xl
        bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0
        group-hover:via-primary/5 group-hover:to-primary/15
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "
        />

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

          {/* Middle Divider */}
          <div className="border-t border-muted/30 my-3" />

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
const InvitationItem = ({ invitation }: { invitation: EInvitation }) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const invitedAt = formatDateRelativeToNow(new Date(invitation.created_at).toISOString(), user.locale);

  const onAccept = () => {
    startTransition(async () => {
      const tmp = await supabase.from("team_member_profiles").insert({
        org_id: invitation.org_id,
        permissions: [],
        profile_id: user.profile.id,
        email: user.email,
        role: invitation.role,
        name: user.profile.first_name,
        last_name: user.profile.last_name,
      });

      if (tmp.error) {
        toast.error(t("err_generic"));
        return;
      }
      await supabase
        .from("invitations")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("id", invitation.id);

      const teamMemberProfiles = await supabase
        .from("team_member_profiles")
        .select("*")
        .eq("profile_id", user.profile.id);

      if (teamMemberProfiles.error) {
        toast.error(t("err_generic"));
        return;
      }
      const orgIds = teamMemberProfiles.data.map((x) => x.org_id);
      const organizations = await supabase.from("organizations").select("*").in("id", orgIds);

      if (organizations.error) {
        toast.error(t("err_generic"));
        return;
      }
      const subscriptions = await supabase.from("subscriptions").select("*").in("org_id", orgIds);

      if (subscriptions.error) {
        toast.error(t("err_generic"));
        return;
      }
      const invitations = await supabase
        .from("invitations")
        .select("*")
        .eq("email", user.email)
        .eq("status", "pending");

      if (invitations.error) {
        toast.error(t("err_generic"));
        return;
      }

      toast.success(t("success_generic"));
      app.setTeamMemberProfiles(teamMemberProfiles.data);
      app.setOrganizations(organizations.data);
      app.setSubscriptions(subscriptions.data);
      app.setReceivedInvitations(invitations.data);
    });
  };
  const onDecline = () => {
    startTransition(async () => {
      const invi = await supabase.from("invitations").update({ status: "declined" }).eq("id", invitation.id);
      if (invi.error) {
        toast.error(t("err_generic"));
        return;
      }

      const invitations = await supabase
        .from("invitations")
        .select("*")
        .eq("email", user.email)
        .eq("status", "pending");
      if (invitations.error) {
        toast.error(t("err_generic"));
        return;
      }
      app.setReceivedInvitations(invitations.data);
    });
  };

  return (
    <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-4 hover:bg-card/80 transition-all duration-200 hover:shadow-sm group">
      {/* Left side */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex justify-center items-center rounded-lg bg-foreground/10 text-foreground p-3 shrink-0 group-hover:bg-foreground/15 transition-colors">
          <MailPlusIcon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm text-foreground">{invitation.org_name}</span>
            <OrgRoleBadge role={invitation.role as TOrganizationRole} />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("label_invited_by")} <span className="font-medium text-foreground">{invitation.inviter_name}</span>
          </p>
          <span className="text-xs text-muted-foreground">{invitedAt}</span>
        </div>
      </div>

      {/* Right side - actions */}
      <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
        <Button
          onClick={onAccept}
          disabled={isPending}
          size="sm"
          className="gap-2 hover:bg-primary/90 transition-colors">
          {!isPending && <CheckIcon className="w-4 h-4" />}
          {isPending && <LoaderIcon className="w-4 h-4 animate-spin" />}
          {t("label_accept")}
        </Button>
        <Button
          onClick={onDecline}
          disabled={isPending}
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors">
          <XIcon className="w-4 h-4" />
          {t("label_decline")}
        </Button>
      </div>
    </Card>
  );
};

export default OrganizationsWrapper;
