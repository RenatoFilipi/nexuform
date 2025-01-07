import Nav from "@/components/private/nav/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  console.log(data.user);

  return (
    <div className="min-h-screen relative flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default DashboardLayout;
