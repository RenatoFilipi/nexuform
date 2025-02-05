import { TSubmissionStatus } from "@/utils/types";
import { Badge } from "../ui/badge";

const SubmissionStatusBadge = ({
  status,
  uppercase = false,
}: {
  status: TSubmissionStatus;
  uppercase?: boolean;
}) => {
  switch (status) {
    case "reviewed":
      return (
        <Badge variant={"success"} uppercase={uppercase}>
          Reviewed
        </Badge>
      );
    case "not_reviewed":
      return (
        <Badge variant={"warning"} uppercase={uppercase}>
          Not Reviewed
        </Badge>
      );
    case "ignored":
      return (
        <Badge variant={"gray"} uppercase={uppercase}>
          Ignored
        </Badge>
      );
  }
};

export default SubmissionStatusBadge;
