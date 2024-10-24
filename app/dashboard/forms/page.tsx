"use client";

import CreateForm from "@/components/private/forms/create-form";
import FormItem from "@/components/private/forms/form-item";
import GenericError from "@/components/private/shared/generic-error";
import { Button } from "@/components/ui/button";
import { dashboardFormsState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import { BookIcon, Loader2Icon } from "lucide-react";
import { Suspense, useState } from "react";

const Forms = () => {
  const [state] = useState<dashboardFormsState>("has_form");

  return (
    <Suspense>
      <div className="flex flex-col h-full gap-10 my-6 mx-3 sm:mx-12 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Forms</h1>
          <div className="flex justify-center items-center gap-4">
            <CreateForm>
              <Button size={"sm"} variant={"secondary"}>
                Create Form
              </Button>
            </CreateForm>
          </div>
        </div>
        {/* loading */}
        {state === "loading" && (
          <div className="h-full flex justify-center items-center">
            <Loader2Icon className="w-6 h-6 animate-spin" />
          </div>
        )}
        {/* no form */}
        {state === "no_form" && (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center gap-4">
              <BookIcon className="w-8 h-8" />
              <div className="flex flex-col justify-center items-center">
                <span className="font-semibold">No form to show</span>
                <span className="text-foreground/80 text-sm">
                  Start by creating your first form.
                </span>
              </div>
            </div>
          </div>
        )}
        {/* has form grid */}
        {state === "has_form" && (
          <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {formList.map((form) => (
              <FormItem
                key={form.id}
                id={form.id}
                title={form.title}
                status={form.status}
                responsesCount={form.responsesCount}
              />
            ))}
          </div>
        )}
        {/* error */}
        {state === "error" && <GenericError />}
      </div>
    </Suspense>
  );
};

export default Forms;
