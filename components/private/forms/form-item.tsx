"use client";

import { Badge2 } from "@/components/ui/badge2";
import { formStatus } from "@/helpers/types";
import { EditIcon, ViewIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

export interface FormItemProps {
  id: string;
  title: string;
  status: formStatus;
  responsesCount: number;
}

const FormItem = ({ title, status, responsesCount, id }: FormItemProps) => {
  const responsesDisplay = (count: number) => {
    return count === 1 ? `${count} Response` : `${count} Responses`;
  };

  const BadgeColor = (status: formStatus) => {
    switch (status) {
      case "published":
        return (
          <Badge2 variant={"green"} uppercase>
            {status}
          </Badge2>
        );
      case "draft":
        return (
          <Badge2 variant={"orange"} uppercase>
            {status}
          </Badge2>
        );
      case "inactive":
        return (
          <Badge2 variant={"gray"} uppercase>
            {status}
          </Badge2>
        );
    }
  };

  return (
    <Card className="flex h-28 p-4 hover:border-foreground/20 items-start flex-col justify-between shadow-none">
      <div className="flex justify-between items-center w-full">
        <span className="text-base font-semibold">{title}</span>
        {BadgeColor(status)}
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="text-foreground/80 text-sm">
          {responsesDisplay(responsesCount)}
        </span>
        <div className="flex justify-center items-center gap-3">
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={`/dashboard/forms/${id}`}>
              <ViewIcon className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href={`/dashboard/editor/${id}`}>
              <EditIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FormItem;
