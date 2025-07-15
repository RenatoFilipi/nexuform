import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAppStore from "@/stores/app";
import useUserStore from "@/stores/user";
import { ETeamMemberProfile } from "@/utils/entities";
import { createClient } from "@/utils/supabase/client";
import { TOrganizationRole, TSetState } from "@/utils/types";
import Avvvatars from "avvvatars-react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";
import OrgRoleBadge from "../../shared/custom/org-role-badge";

const MembersRemove = ({
  children,
  self,
  member,
}: {
  children: ReactNode;
  self: boolean;
  member: ETeamMemberProfile;
}) => {
  const t = useTranslations("app");
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="backdrop-blur-sm">
        <AlertDialogContent className="flex flex-col w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("label_remove_member")}</AlertDialogTitle>
            <AlertDialogDescription>{t("desc_remove_member")}</AlertDialogDescription>
          </AlertDialogHeader>
          <Body setState={setOpen} self={self} member={member} />
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const Body = ({
  setState,
  self,
  member,
}: {
  setState: TSetState<boolean>;
  self: boolean;
  member: ETeamMemberProfile;
}) => {
  const t = useTranslations("app");
  const user = useUserStore();
  const app = useAppStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();
  const name = `${member.name} ${member.last_name}`;

  const onRemove = async () => {
    startTransition(async () => {
      const response = await supabase.from("team_member_profiles").delete().eq("id", member.id);
      if (response.error) {
        toast.error(t("err_generic"));
        return;
      }

      if (self) {
        router.push("/dashboard/organizations");
        return;
      }

      const tmp = await supabase.from("team_member_profiles").select("*").eq("org_id", app.teamMemberProfile.org_id);
      if (tmp.error) {
        toast.error(t("err_generic"));
        return;
      }

      app.setTeamMemberProfiles(tmp.data);
      setState(false);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative p-4 md:p-6 rounded-lg bg-gradient-to-br from-muted/20 to-background border border-muted/30 shadow-sm w-full">
        <div className="flex flex-col items-center gap-4 w-full">
          <motion.div
            animate={{
              opacity: 1,
              boxShadow: [
                "0 0 0 0 rgba(220, 38, 38, 0.7)",
                "0 0 0 10px rgba(220, 38, 38, 0)",
                "0 0 0 0 rgba(220, 38, 38, 0)",
              ],
              borderColor: ["rgb(220 38 38 / 0.7)", "rgb(220 38 38 / 0.3)", "rgb(220 38 38 / 0.7)"],
            }}
            transition={{
              delay: 0.2,
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-destructive/10 rounded border border-destructive/30 w-full p-0">
            <Card className="p-3 md:p-4 w-full flex flex-col sm:flex-row justify-between items-center gap-4 bg-destructive/5">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Avvvatars value={member.email} size={48} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm md:text-base font-medium truncate">{name}</span>
                  <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
                <OrgRoleBadge role={member.role as TOrganizationRole} />
                <span className="text-xs text-muted-foreground">
                  {t("label_joined")}: {new Date(member.created_at).toLocaleDateString(user.locale)}
                </span>
              </div>
            </Card>
          </motion.div>
          <Badge variant="destructive" className="text-xs md:text-sm mt-4">
            {t("label_action_undone")}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-2 w-full justify-between">
        <Button
          disabled={isPending}
          onClick={() => setState(false)}
          variant="outline"
          size="sm"
          className="w-full sm:w-fit gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          {t("label_back")}
        </Button>
        <Button
          disabled={isPending}
          onClick={onRemove}
          variant="destructive_outline"
          size="sm"
          className="w-full sm:w-fit gap-2">
          <Trash2Icon className="w-4 h-4" />
          {t("label_remove_member")}
        </Button>
      </div>
    </div>
  );
};

export default MembersRemove;
