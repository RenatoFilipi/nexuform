import { Badge } from "@/components/ui/badge";
import { TOrganizationRole } from "@/utils/types";
import { CrownIcon, HardHatIcon, ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const OrgRoleBadge = ({ role, uppercase = false }: { role: TOrganizationRole; uppercase?: boolean }) => {
  const t = useTranslations("app");

  switch (role) {
    case "owner": {
      return (
        <Badge variant={"gold"} uppercase={uppercase} className="w-fit">
          <CrownIcon className="w-4 h-4" />
          {t("label_owner")}
        </Badge>
      );
    }
    case "admin": {
      return (
        <Badge variant={"pink"} uppercase={uppercase} className="w-fit">
          <ShieldCheckIcon className="w-4 h-4" />
          {t("label_admin")}
        </Badge>
      );
    }
    case "staff": {
      return (
        <Badge variant={"info"} uppercase={uppercase} className="w-fit">
          <HardHatIcon className="w-4 h-4" />
          {t("label_staff")}
        </Badge>
      );
    }
  }
};

export default OrgRoleBadge;
