import SettingsNavbar from "@/components/private/settings/settings-navbar";

const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col h-dvh relative">
      <SettingsNavbar />
      <div className="px-4 sm:px-10 lg:px-80 pt-16">{children}</div>
    </div>
  );
};

export default SettingsLayout;
