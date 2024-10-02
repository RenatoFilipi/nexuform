"use client";

import CreateForm from "@/components/private/create-form";
import FormCard from "@/components/private/form-card";
import { Button } from "@/components/ui/button";
import { BookDashedIcon, Loader2Icon } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full gap-10 my-6 mx-6 sm:mx-12 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <CreateForm>
          <Button size={"sm"} variant={"secondary"}>
            Create Form
          </Button>
        </CreateForm>
      </div>
      {/* loading state */}
      {false && (
        <div className="h-full flex justify-center items-center">
          <Loader2Icon className="w-8 h-8 animate-spin" />
        </div>
      )}
      {/* no form */}
      {true && (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col justify-center items-center gap-4">
            <BookDashedIcon className="w-8 h-8" />
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
      {false && (
        <div className="overflow-y-auto grid gap-8 grid-cols-1 sm:grid-cols-3">
          <FormCard title="Customer Success" />
          <FormCard title="Product Feedback" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
