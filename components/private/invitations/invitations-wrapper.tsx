"use client";

import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { EInvitation, EProfile } from "@/utils/entities";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import LoadingUI from "../shared/custom/loading-ui";
import OrgRoleBadge from "../shared/custom/org-role-badge";
import { CheckIcon, LoaderIcon, MailPlusIcon, MailXIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TOrganizationRole } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useTransition } from "react";
import { formatDateRelativeToNow } from "@/utils/functions";

interface IProps {
  locale: string;
  email: string;
  profile: EProfile;
  invitations: EInvitation[];
}

const InvitationsWrapper = (props: IProps) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const hasPendingInvitations = app.receivedInvitations.length > 0;

  const query = useQuery({
    queryKey: ["invitations-page"],
    queryFn: () => {
      user.setLocale(props.locale);
      user.setEmail(props.email);
      user.setProfile(props.profile);
      app.setReceivedInvitations(props.invitations);
      return null;
    },
  });

  if (query.isPending)
    return (
      <div className="flex-1 mt-24 mb-14 sm:mb-0 flex flex-col gap-8 px-3 sm:px-20 lg:px-80 py-4 sm:py-8">
        <LoadingUI />
      </div>
    );

  return (
    <div className="flex-1 mt-24 mb-14 sm:mb-0 flex flex-col gap-8 px-3 sm:px-20 lg:px-80 py-4 sm:py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("label_invitations")}</h2>
        </div>
        {!hasPendingInvitations && (
          <Card className="flex w-full justify-center items-center flex-col gap-4 py-28 px-4">
            <div className="flex justify-center items-center p-3 w-fit rounded bg-foreground/5">
              <MailXIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col justify-center items-center gap-1 text-center">
              <h3 className="text-muted-foreground max-w-md text-sm/relaxed">{t("label_no_pending_invitations")}</h3>
            </div>
          </Card>
        )}
        {hasPendingInvitations && (
          <ul className="flex flex-col border border-border rounded-xl overflow-hidden bg-card divide-y divide-border">
            {app.receivedInvitations.map((invitation) => (
              <InvitationItem key={invitation.id} invitation={invitation} />
            ))}
          </ul>
        )}
      </div>
    </div>
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

export default InvitationsWrapper;
