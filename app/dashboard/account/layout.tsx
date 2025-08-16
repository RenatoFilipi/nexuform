import AccountNavbar from "@/components/private/shared/navs/account-navbar";

const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-14 flex flex-col relative">
      <AccountNavbar />
      <div className="px-4 sm:px-10 lg:px-96 py-14 sm:py-20">{children}</div>
    </div>
  );
};

export default AccountLayout;
