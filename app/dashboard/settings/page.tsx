import SettingsWrapper from "@/components/private/settings/settings-wrapper";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const Settings = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    return (
      <div className="flex justify-center items-center pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
        <div className="flex flex-col justify-center items-center gap-4">
          <span className="text-sm text-foreground/80">
            Error on loading settings
          </span>
          <Button variant={"outline"} size={"xs"} asChild>
            <Link href={"/dashboard"}>Go back</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
      <SettingsWrapper profile={profile} />
    </div>
  );
};

export default Settings;
