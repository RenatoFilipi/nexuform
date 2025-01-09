import {
  BlocksIcon,
  ListOrderedIcon,
  PaintbrushIcon,
  Settings2Icon,
} from "lucide-react";

const tips = [
  {
    title: "Add Blocks",
    desc: "Add new blocks to enrich your form.",
    icon: BlocksIcon,
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-600",
  },
  {
    title: "Customize Appearance",
    desc: "Customize the layout and appearance of your form.",
    icon: PaintbrushIcon,
    bgColor: "bg-green-500/20",
    textColor: "text-green-600",
  },
  {
    title: "Update Settings",
    desc: "Configure your form preferences and update settings.",
    icon: Settings2Icon,
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-600",
  },
  {
    title: "Reorder Blocks",
    desc: "Reorder the blocks in your form to adjust the structure.",
    icon: ListOrderedIcon,
    bgColor: "bg-purple-500/20",
    textColor: "text-purple-600",
  },
];

const EditorTips = () => {
  return (
    <ul className="grid grid-cols-1 gap-8">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start gap-4">
          <div
            className={`flex justify-center items-center w-12 h-12 rounded-md ${tip.bgColor}`}>
            <tip.icon className={`w-6 h-6 ${tip.textColor}`} />
          </div>
          <div>
            <h3 className="text-foreground font-medium">{tip.title}</h3>
            <p className="text-foreground/80 text-sm">{tip.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EditorTips;
