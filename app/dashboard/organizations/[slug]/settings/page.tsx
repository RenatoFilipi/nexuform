import SettingsWrapper from "@/components/private2/organization/settings/settings-wrapper";

const Settings = async ({ params }: { params: Promise<{ slug: string }> }) => {
  return <SettingsWrapper />;
};
export default Settings;
