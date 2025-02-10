import SettingsWrapper from "@/components/private/settings/settings-wrapper";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const Settings = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    return <ErrorUI />;
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (subscriptionError) {
    return <ErrorUI />;
  }

  return <SettingsWrapper profile={profile} subscription={subscription} />;
};

const ErrorUI = () => {
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
};

export default Settings;
