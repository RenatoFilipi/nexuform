import { TSubmissionStatus } from "@/utils/types";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

const SubmissionStatusBadge = ({ status, uppercase = false }: { status: TSubmissionStatus; uppercase?: boolean }) => {
  const t = useTranslations("app");
  switch (status) {
    case "reviewed":
      return (
        <Badge variant={"success"} uppercase={uppercase}>
          {t("label_reviewed")}
        </Badge>
      );
    case "not_reviewed":
      return (
        <Badge variant={"warning"} uppercase={uppercase}>
          {t("label_not_reviewed")}
        </Badge>
      );
    case "ignored":
      return (
        <Badge variant={"gray"} uppercase={uppercase}>
          {t("label_ignored")}
        </Badge>
      );
  }
};

export default SubmissionStatusBadge;
