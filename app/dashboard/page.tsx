"use client";

import CreateForm from "@/components/private/create-form";
import FormCard from "@/components/private/form-card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full gap-10 my-6 mx-6 sm:mx-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <CreateForm>
          <Button size={"sm"} variant={"secondary"}>
            Create Form
          </Button>
        </CreateForm>
      </div>
      {/* loading state */}

      {/* has forms */}
      {false && (
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-10">
          <FormCard title="Customer Success" />
          <FormCard title="Product Feedback" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
