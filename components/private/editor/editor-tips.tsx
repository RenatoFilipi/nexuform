import { BrushIcon, LayersIcon, ShareIcon, SlidersIcon } from "lucide-react";

const tips = [
  {
    title: "Build Your Form",
    desc: "Start by adding blocks like text fields, multiple choice, and more.",
    icon: LayersIcon,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  {
    title: "Customize the Look",
    desc: "Adjust colors, order, and layout to match your brand.",
    icon: BrushIcon,
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
  },
  {
    title: "Set Up Preferences",
    desc: "Define settings like title, description, and permissions.",
    icon: SlidersIcon,
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-500",
  },
  {
    title: "Publish & Share",
    desc: "Make your form available and share it with your audience.",
    icon: ShareIcon,
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500",
  },
];

const EditorTips = () => {
  return (
    <ul className="grid sm:grid-cols-2 gap-8">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start gap-4">
          <div className={`flex justify-center items-center w-10 h-10 rounded-lg ${tip.bgColor}`}>
            <tip.icon className={`w-5 h-5 ${tip.textColor}`} />
          </div>
          <div>
            <h3 className="text-foreground font-medium text-sm">{tip.title}</h3>
            <p className="text-foreground/80 text-xs">{tip.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EditorTips;
