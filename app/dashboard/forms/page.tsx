import DashboardWrapper from "@/components/private/dashboard/dashboard-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Forms = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("login");
  }
  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: true });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("profile_id", data.user.id)
    .single();

  if (formsError || profileError || subscriptionError) {
    console.log(formsError);
    console.log(profileError);
    console.log(subscriptionError);
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4 overflow-y-auto pb-6 pt-3 px-3 sm:px-12 flex-1 mt-16">
        <div className="flex flex-col justify-center items-center gap-2">
          <span className="">Something went wrong</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardWrapper
      forms={forms}
      profile={profile}
      subscription={subscription}
    />
  );
};

export default Forms;
