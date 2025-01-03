import Nav from "@/components/private/nav";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // const supabase = await createClient();
  // const { data } = await supabase.auth.getUser();
  // if (!data.user) {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen relative flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default DashboardLayout;
