import FormCreate from "@/components/private/dashboard/form-create";
import FormList from "@/components/private/dashboard/form-list";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const Forms = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }
  const { data: forms } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Forms</h1>
        <div className="flex justify-center items-center gap-4">
          <Suspense>
            <FormCreate userId={data.user.id}>
              <Button size={"sm"} variant={"default"}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create New Form
              </Button>
            </FormCreate>
          </Suspense>
        </div>
      </div>
      <FormList forms={forms ?? []} userId={data.user.id} />
    </div>
  );
};

export default Forms;
