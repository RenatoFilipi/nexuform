import { Badge } from "../ui/badge";

const IntegrationStatusBadge = ({ active, uppercase = false }: { active: boolean; uppercase?: boolean }) => {
  switch (active) {
    case true:
      return (
        <Badge variant={"success"} uppercase={uppercase}>
          Active
        </Badge>
      );
    case false:
      return (
        <Badge variant={"gray"} uppercase={uppercase}>
          Inactive
        </Badge>
      );
  }
};

export default IntegrationStatusBadge;
