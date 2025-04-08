import { TFormStatus } from "@/utils/types";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

const FormStatusBadge = ({ status, uppercase = false }: { status: TFormStatus; uppercase?: boolean }) => {
  const t = useTranslations("app");

  switch (status) {
    case "published":
      return (
        <Badge variant={"success"} uppercase={uppercase} className="w-fit">
          {t("label_published")}
        </Badge>
      );
    case "draft":
      return (
        <Badge variant={"warning"} uppercase={uppercase} className="w-fit">
          {t("label_draft")}
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant={"default"} uppercase={uppercase} className="w-fit">
          {t("label_inactive")}
        </Badge>
      );
  }
};

export default FormStatusBadge;
