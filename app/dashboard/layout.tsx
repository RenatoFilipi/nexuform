import Navbar from "@/components/private/shared/core/navbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh relative flex flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
