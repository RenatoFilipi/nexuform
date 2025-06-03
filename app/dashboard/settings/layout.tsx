import SettingsNav from "@/components/private/settings/settings-nav";

const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 mt-14 mb-14 sm:mb-0 flex flex-col h-dvh relative">
      <SettingsNav />
      <div className="px-4 sm:px-72 pt-16">{children}</div>
    </div>
  );
};

export default SettingsLayout;
