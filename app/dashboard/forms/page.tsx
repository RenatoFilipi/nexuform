"use client";

import GenericError from "@/components/core/generic-error";
import GenericLoader from "@/components/core/generic-loader";
import FormCard from "@/components/private/forms/form-card";
import FormCreate from "@/components/private/forms/form-create";
import { Button } from "@/components/ui/button";
import { mockForms } from "@/helpers/mocks";
import { FormProps } from "@/helpers/modules";
import { appState } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { BookMarkedIcon } from "lucide-react";
import { useState } from "react";

const Forms = () => {
  const [appState, setAppState] = useState<appState>("loading");
  const [forms, setForms] = useState<FormProps[]>([]);

  useQuery({
    queryKey: ["formsData"],
    queryFn: () => {
      setForms(mockForms);
      setAppState("idle");
      return null;
    },
  });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-14">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Forms</h1>
        <div className="flex justify-center items-center gap-4">
          <FormCreate>
            <Button size={"sm"} variant={"default"}>
              Create Form
            </Button>
          </FormCreate>
        </div>
      </div>
      {appState === "loading" && (
        <div className="h-full flex-1 flex justify-center items-center">
          <div className="flex justify-center items-center flex-col gap-3">
            <GenericLoader className="w-8 h-8" />
          </div>
        </div>
      )}
      {appState === "idle" && forms.length <= 0 && (
        <div className="flex justify-center items-center h-full flex-1">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="flex justify-center items-center p-3 rounded bg-primary/15">
                <BookMarkedIcon className="text-primary" />
              </div>
              <div className="flex flex-col justify-center items-center gap-1">
                <span className="text-lg font-medium">No form to show</span>
                <span className="text-foreground/80 text-sm text-center">
                  Create your very first form and start collecting responses
                  effortlessly.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {appState === "idle" && forms.length >= 1 && (
        <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              id={form.id}
              name={form.name}
              status={form.status}
              submissions={form.submissions}
              views={form.views}
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
