import Nav from "@/components/private/core/nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return redirect("login");

  return (
    <div className="min-h-screen relative flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default DashboardLayout;
