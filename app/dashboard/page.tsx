import FormCard from "@/components/private/form-card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full gap-10 m-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button size={"sm"} variant={"secondary"}>
          Create Form
        </Button>
      </div>
      <div className="sm:grid sm:grid-cols-3 gap-10 flex flex-col flex-1">
        <FormCard title="Customer Success" />
        <FormCard title="Product Feedback" />
      </div>
    </div>
  );
};

export default Dashboard;
