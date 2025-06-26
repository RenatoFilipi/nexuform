import Navbar from "@/components/private2/shared/navs/navbar";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const path = (await headers()).get("x-current-path") as string;

  return (
    <div className="min-h-dvh relative flex flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
