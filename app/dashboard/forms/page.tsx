import FormList from "@/components/private/dashboard/form-list";
import FormCreate from "@/components/private/forms/form-create";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Forms = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }
  const { data: forms } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id);

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Forms</h1>
        <div className="flex justify-center items-center gap-4">
          <FormCreate>
            <Button size={"sm"} variant={"default"}>
              New Form
            </Button>
          </FormCreate>
        </div>
      </div>
      <FormList forms={forms ?? []} />
    </div>
  );
};

export default Forms;
