import SettingsWrapper from "@/components/private/settings/settings-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Settings = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <SettingsWrapper />
    </div>
  );
};

export default Settings;
