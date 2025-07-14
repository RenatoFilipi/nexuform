import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TOrganizationRole, TSetState } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { ETeamMemberProfile } from "@/utils/entities";
import { Card } from "@/components/ui/card";
import Avvvatars from "avvvatars-react";
import OrgRoleBadge from "../../shared/custom/org-role-badge";
import useUserStore from "@/stores/user";
import { motion } from "framer-motion";
import { Trash2Icon, UserRoundXIcon, ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        <AlertDialogContent className="flex flex-col w-full max-w-md md:max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="">Remove Member</AlertDialogTitle>
            <AlertDialogDescription className="">
              This will remove the member from the organization. This action is permanent.
            </AlertDialogDescription>
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
  const name = `${member.name} ${member.last_name}`;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative p-4 md:p-6 rounded-lg bg-gradient-to-br from-muted/20 to-background border border-muted/30 shadow-sm w-full">
        <Card className="p-3 md:p-4 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
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

        <div className="flex flex-col items-center gap-4 mt-10 mb-4">
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
            className="p-3 bg-destructive/10 rounded-xl border border-destructive/30">
            <UserRoundXIcon className="text-destructive w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
          <Badge variant="destructive" className="text-xs md:text-sm">
            {t("label_action_undone")}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 w-full justify-between">
        <Button onClick={() => setState(false)} variant="outline" size="sm" className="w-full sm:w-fit gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          {t("label_back")}
        </Button>
        <Button variant="destructive_outline" size="sm" className="w-full sm:w-fit gap-2">
          <Trash2Icon className="w-4 h-4" />
          Remove Member
        </Button>
      </div>
    </div>
  );
};

export default MembersRemove;
