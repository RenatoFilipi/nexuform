import { EditIcon, ViewIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export interface FormCardProps {
  id: string;
  title: string;
  status: "inactive" | "draft" | "published";
  responsesCount: number;
}

const FormCard = ({ title, status, responsesCount }: FormCardProps) => {
  const responsesDisplay = (count: number) => {
    return count === 1 ? `${count} Response` : `${count} Responses`;
  };

  return (
    <Card className="flex h-40 p-4 hover:border-foreground/20 items-start flex-col justify-between">
      <div className="flex justify-between items-center w-full">
        <span className="font-semibold text-lg">{title}</span>
        {status === "draft" && <Badge variant={"warning"}>{status}</Badge>}
        {status === "published" && <Badge variant={"success"}>{status}</Badge>}
        {status === "inactive" && <Badge variant={"secondary"}>{status}</Badge>}
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="text-foreground/80 text-sm">
          {responsesDisplay(responsesCount)}
        </span>
        <div className="flex justify-center items-center gap-2">
          <Button variant={"outline"} size={"sm"}>
            <ViewIcon className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button variant={"outline"} size={"sm"}>
            <EditIcon className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FormCard;
