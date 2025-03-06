import { TFormStatus } from "@/utils/types";
import { Badge } from "../ui/badge";

const FormStatusBadge = ({ status, uppercase = false }: { status: TFormStatus; uppercase?: boolean }) => {
  switch (status) {
    case "published":
      return (
        <Badge variant={"success"} uppercase={uppercase}>
          Published
        </Badge>
      );
    case "draft":
      return (
        <Badge variant={"warning"} uppercase={uppercase}>
          Draft
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant={"default"} uppercase={uppercase}>
          Inactive
        </Badge>
      );
  }
};

export default FormStatusBadge;
