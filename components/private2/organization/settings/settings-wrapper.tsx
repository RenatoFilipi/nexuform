"use client";

import { useTranslations } from "next-intl";
import WipUI from "../../shared/custom/wip-ui";

const SettingsWrapper = () => {
  const t = useTranslations("app");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{t("label_settings")}</h1>
      </div>
      <div className="flex flex-col gap-10">
        <SettingsOrgName />
        <SettingsOrgStatus />
      </div>
    </div>
  );
};

const SettingsOrgName = () => {
  return (
    <div>
      <WipUI context="Settings org name" />
    </div>
  );
};
const SettingsOrgStatus = () => {
  return (
    <div>
      <WipUI context="Settings org status" />
    </div>
  );
};
export default SettingsWrapper;
