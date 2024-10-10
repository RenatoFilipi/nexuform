"use client";

import { EditIcon, ViewIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

export interface FormItemProps {
  id: string;
  title: string;
  status: "inactive" | "draft" | "published";
  responsesCount: number;
}

const FormItem = ({ title, status, responsesCount, id }: FormItemProps) => {
  const responsesDisplay = (count: number) => {
    return count === 1 ? `${count} Response` : `${count} Responses`;
  };

  return (
    <Card className="flex h-40 p-4 hover:border-foreground/20 items-start flex-col justify-between">
      <div className="flex justify-between items-center w-full">
        <span className="font-semibold text-lg">{title}</span>
        {status === "draft" && <Badge variant={"default"}>{status}</Badge>}
        {status === "published" && <Badge variant={"default"}>{status}</Badge>}
        {status === "inactive" && (
          <Badge variant={"destructive"}>{status}</Badge>
        )}
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="text-foreground/80 text-sm">
          {responsesDisplay(responsesCount)}
        </span>
        <div className="flex justify-center items-center gap-2">
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={`/dashboard/forms/${id}`}>
              <ViewIcon className="w-4 h-4 mr-2" />
              View
            </Link>
          </Button>
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={`/dashboard/editor/${id}`}>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FormItem;
