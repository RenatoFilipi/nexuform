import { TFormStatus } from "@/utils/types";
import { Badge } from "../ui/badge";

const FormStatusBadge = ({ status, uppercase = false }: { status: TFormStatus; uppercase?: boolean }) => {
  switch (status) {
    case "published":
      return (
        <Badge variant={"success"} uppercase={uppercase}>
          {status}
        </Badge>
      );
    case "draft":
      return (
        <Badge variant={"warning"} uppercase={uppercase}>
          {status}
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant={"default"} uppercase={uppercase}>
          {status}
        </Badge>
      );
  }
};

export default FormStatusBadge;
