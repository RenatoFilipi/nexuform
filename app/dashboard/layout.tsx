import AppNav from "@/components/private/app-nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen relative flex flex-col">
      <AppNav />
      {children}
    </div>
  );
};

export default DashboardLayout;
