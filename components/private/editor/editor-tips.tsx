import { LayersIcon, PaintbrushIcon, SettingsIcon, Share2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

const EditorTips = () => {
  const t = useTranslations("app");
  const tips = [
    {
      title: t("label_tips_form"),
      desc: t("desc_tips_form"),
      icon: LayersIcon,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      title: t("label_tips_design"),
      desc: t("desc_tips_design"),
      icon: PaintbrushIcon,
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      title: t("label_tips_settings"),
      desc: t("desc_tips_settings"),
      icon: SettingsIcon,
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-500",
    },
    {
      title: t("label_tips_share"),
      desc: t("desc_tips_share"),
      icon: Share2Icon,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
  ];
  return (
    <ul className="grid sm:grid-cols-2 gap-4 sm:gap-10 px-4">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start flex-col gap-4 w-full border rounded p-4">
          <div className={`flex justify-center items-center w-10 h-10 rounded-lg ${tip.bgColor}`}>
            <tip.icon className={`w-5 h-5 ${tip.textColor}`} />
          </div>
          <div>
            <h3 className="text-foreground font-medium text-sm">{tip.title}</h3>
            <p className="text-foreground/70 text-xs">{tip.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EditorTips;
