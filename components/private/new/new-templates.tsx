import { useTranslations } from "next-intl";

const NewTemplates = () => {
  const t = useTranslations("app");

  return (
    <div>
      <div className="grid gap-1">
        <span className="font-semibold">{t("label_templates")}</span>
        <p className="text-xs text-foreground/70">{t("desc_templates")}</p>
      </div>
    </div>
  );
};

export default NewTemplates;
