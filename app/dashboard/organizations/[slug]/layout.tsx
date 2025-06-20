"use client";

import OrganizationsNavbar from "@/components/private/organizations/organizations-navbar";
import { usePathname } from "next/navigation";

const OrgFormsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isEditorMode = pathname.endsWith("editor");

  if (isEditorMode) {
    return (
      <div className={`mt-14 flex flex-col relative`}>
        <div className="py-14">{children}</div>
      </div>
    );
  }

  return (
    <div className={`mt-14 flex flex-col relative`}>
      <OrganizationsNavbar />
      <div className="px-4 sm:px-10 lg:px-60 py-14 sm:py-20">{children}</div>
    </div>
  );
};
export default OrgFormsLayout;
