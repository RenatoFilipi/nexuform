"use client";

import { Button } from "@/components/ui/button";
import { EForm } from "@/utils/entities";
import { BookIcon, PlusIcon } from "lucide-react";
import FormCard from "./form-card";
import FormCreate from "./form-create";

const FormList = ({ forms, userId }: { forms: EForm[]; userId: string }) => {
  if (forms.length === 0) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-4">
        <div className="border p-20 flex flex-col justify-center items-center gap-6 border-none">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center p-3 bg-foreground/5 rounded">
              <BookIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex justify-center items-center flex-col">
              <span className="text-lg font-medium">No forms available</span>
              <span className="text-sm text-center text-foreground/80">
                Create your very first form and start collecting responses
                effortlessly.
              </span>
            </div>
          </div>
          <FormCreate userId={userId}>
            <Button variant={"default"} size={"sm"}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create New Form
            </Button>
          </FormCreate>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default FormList;
