"use client";

import CreateForm from "@/components/private/create-form";
import FormCard from "@/components/private/form-card";
import GenericError from "@/components/private/generic-error";
import { Button } from "@/components/ui/button";
import { BookIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

type state = "loading" | "no_form" | "has_form" | "error";

const Forms = () => {
  const [state] = useState<state>("no_form");

  return (
    <div className="flex flex-col h-full gap-10 my-6 mx-6 sm:mx-12 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Forms</h1>
        <CreateForm>
          <Button size={"sm"} variant={"secondary"}>
            Create Form
          </Button>
        </CreateForm>
      </div>
      {/* loading */}
      {state === "loading" && (
        <div className="h-full flex justify-center items-center">
          <Loader2Icon className="w-8 h-8 animate-spin" />
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
      {/* has form */}
      {state === "has_form" && (
        <div className="overflow-y-auto grid gap-8 grid-cols-1 sm:grid-cols-3">
          <FormCard title="Customer Success" />
          <FormCard title="Product Feedback" />
        </div>
      )}
      {/* error */}
      {state === "error" && <GenericError />}
    </div>
  );
};

export default Forms;
