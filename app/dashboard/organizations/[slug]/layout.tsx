import OrganizationsNavbar from "@/components/private/organizations/organizations-navbar";

const OrgFormsLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col mt-14 relative">
      <OrganizationsNavbar />
      <div className="px-4 sm:px-10 lg:px-60 py-16">{children}</div>
    </div>
  );
};
export default OrgFormsLayout;
