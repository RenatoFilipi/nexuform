import { Badge } from "@/components/ui/badge";
import { TOrganizationRole } from "@/utils/types";
import { HardHatIcon, ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const OrgRoleBadge = ({ role, uppercase = false }: { role: TOrganizationRole; uppercase?: boolean }) => {
  const t = useTranslations("app");

  switch (role) {
    case "admin": {
      return (
        <Badge variant={"gold"} uppercase={uppercase} className="w-fit">
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
