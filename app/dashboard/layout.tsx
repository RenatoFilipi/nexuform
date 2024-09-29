import Nav from "@/components/private/nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen relative flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default DashboardLayout;
