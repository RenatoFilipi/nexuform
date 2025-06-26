"use client";

import FormNavbar from "@/components/private2/shared/form-navbar";
import OrganizationNavbar from "@/components/private2/shared/organization-navbar";
import { usePathname } from "next/navigation";

const OrgFormsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const formId = pathname.split("/")[5];
  const isEditorResource = pathname.split("/")[6] === "editor";
  const isFormResource = pathname.split("/")[4] === "form";

  if (isEditorResource) {
    return (
      <div className="h-dvh max-h-dvh flex flex-col relative">
        <div className="mt-14 flex h-full w-full overflow-y-hidden">{children}</div>
      </div>
    );
  }

  if (isFormResource) {
    return (
      <div className="mt-14 flex flex-col relative">
        <FormNavbar />
        <div className="px-4 sm:px-10 lg:px-60 py-14 sm:py-20">{children}</div>
      </div>
    );
  }

  return (
    <div className="mt-14 flex flex-col relative">
      {!formId && <OrganizationNavbar />}
      <div className="px-4 sm:px-10 lg:px-60 py-14 sm:py-20">{children}</div>
    </div>
  );
};
export default OrgFormsLayout;
