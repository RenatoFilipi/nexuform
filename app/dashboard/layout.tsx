import Nav from "@/components/private/shared/core/nav";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh relative flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default DashboardLayout;
