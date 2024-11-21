"use client";

import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import CreateForm from "@/components/private/forms/create-form";
import FormItem from "@/components/private/forms/form-item";
import { Button } from "@/components/ui/button";
import { FormItemProps } from "@/helpers/interfaces";
import { appState } from "@/helpers/types";
import { formList } from "@/mocks/forms";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Forms = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const [forms, setForms] = useState<FormItemProps[]>([]);

  useQuery({
    queryKey: ["formsData"],
    queryFn: () => {
      setForms(formList);
      setAppState("idle");
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Forms</h1>
        <div className="flex justify-center items-center gap-4">
          <CreateForm>
            <Button size={"sm"} variant={"default"}>
              Create Form
            </Button>
          </CreateForm>
        </div>
      </div>
      {appState === "loading" && (
        <div className="h-full flex-1 flex justify-center items-center">
          <div className="flex justify-center items-center flex-col gap-3">
            <GenericLoader className="w-8 h-8 animate-spin" />
          </div>
        </div>
      )}
      {appState === "idle" && forms.length <= 0 && (
        <div className="flex justify-center items-center h-full flex-1">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex flex-col justify-center items-center">
              <span className="font-semibold">No form to show.</span>
              <span className="text-foreground/80 text-sm">
                Start by creating your first form.
              </span>
            </div>
          </div>
        </div>
      )}
      {appState === "idle" && forms.length >= 1 && (
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
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
      {appState === "error" && (
        <div className="flex justify-center items-center h-full flex-1">
          <GenericError />
        </div>
      )}
    </div>
  );
};

export default Forms;
