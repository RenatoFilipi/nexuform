"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formList } from "@/mocks/forms";
import { BookIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const Form = () => {
  const pathname = usePathname();
  const currentFormId = pathname.split("/")[3];
  const currentForm = formList.find((x) => x.id === currentFormId);

  return (
    <div className="flex flex-col h-full gap-10 my-6 mx-6 sm:mx-12 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-4 sm:gap-8">
          <div className="flex justify-center items-center gap-2">
            <BookIcon className="w-5 h-5" />
            <span className="font-semibold">{currentForm?.title}</span>
          </div>
          <Badge>{currentForm?.status}</Badge>
        </div>
        <Button variant={"secondary"} size={"sm"}>
          Edit Form
        </Button>
      </div>
    </div>
  );
};

export default Form;
