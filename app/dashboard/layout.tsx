import Nav from "@/components/core/nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default DashboardLayout;
