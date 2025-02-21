import { Button } from "@/components/ui/button";
import useFormsStore from "@/stores/forms";
import useUserStore from "@/stores/user";
import { LayersIcon, PlusIcon } from "lucide-react";
import DashboardFormCard from "./dashboard-form-card";
import DashboardNewForm from "./dashboard-new-form";

const DashboardForms = () => {
  const { forms } = useFormsStore();
  const { profile } = useUserStore();

  if (forms.length === 0) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-4">
        <div className="border pb-20 flex flex-col justify-center items-center gap-6 border-none">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex justify-center items-center p-3 bg-foreground/5 rounded">
              <LayersIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex justify-center items-center flex-col">
              <span className="text-lg font-medium">No forms yet</span>
              <span className="text-sm text-center text-foreground/70">
                Get started by creating your first form and collecting responses with ease.
              </span>
            </div>
          </div>
          <DashboardNewForm userId={profile.id}>
            <Button variant={"secondary"} size={"sm"}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Form
            </Button>
          </DashboardNewForm>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <DashboardFormCard key={form.id} form={form} />
      ))}
    </div>
  );
};

export default DashboardForms;
